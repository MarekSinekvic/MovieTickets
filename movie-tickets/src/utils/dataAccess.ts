import isomorphicFetch from "isomorphic-unfetch";

import { PagedCollection } from "../types/collection";
import { Item } from "../types/item";
import { ENTRYPOINT } from "../config/entrypoint";

const MIME_TYPE = "application/ld+json";

interface Violation {
  message: string;
  propertyPath: string;
}

export interface FetchResponse<TData> {
  hubURL: string | null;
  data: TData;
  text: string;
}

export interface FetchError {
  message: string;
  status: string;
  fields: { [key: string]: string };
}

const extractHubURL = (response: Response): null | URL => {
  const linkHeader = response.headers.get("Link");
  if (!linkHeader) return null;

  const matches = linkHeader.match(
    /<([^>]+)>;\s+rel=(?:mercure|"[^"]*mercure[^"]*")/
  );

  return matches && matches[1] ? new URL(matches[1], ENTRYPOINT) : null;
};

export const fetch = async <TData>(
  id: string,
  init: RequestInit = {}
): Promise<FetchResponse<TData> | undefined> => {
  if (typeof init.headers === "undefined") init.headers = {};
  if (!init.headers.hasOwnProperty("Accept"))
    init.headers = { ...init.headers, Accept: MIME_TYPE };
  if (
    init.body !== undefined &&
    !(init.body instanceof FormData) &&
    !init.headers?.hasOwnProperty("Content-Type")
  )
    init.headers = { ...init.headers, "Content-Type": MIME_TYPE };

  const pathNodes = id.split('/');
  if (pathNodes[1] == 'api') id = id.slice(4);
  const resp = await isomorphicFetch(ENTRYPOINT + id, init);
  if (resp.status === 204) return;

  const text = await resp.text();
  const json = JSON.parse(text);
  if (resp.ok) {
    return {
      hubURL: extractHubURL(resp)?.toString() || null, // URL cannot be serialized as JSON, must be sent as string
      data: json,
      text,
    };
  }

  const errorMessage = json["truetitle"];
  const status = json["truedescription"] || resp.statusText;
  if (!json.violations) throw Error(errorMessage);
  const fields: { [key: string]: string } = {};
  json.violations.map(
    (violation: Violation) =>
      (fields[violation.propertyPath] = violation.message)
  );

  throw { message: errorMessage, status, fields } as FetchError;
};

export const getItemPath = (
  iri: string | undefined,
  pathTemplate: string
): string => {
  if (!iri) {
    return "";
  }
  const resourceId = iri.split("/").slice(-1)[0];

  return pathTemplate.replace("[id]", resourceId);
};

export const parsePage = (resourceName: string, path: string) =>
  parseInt(
    new RegExp(`/?page=(\\d+)`).exec(path)?.[1] ?? "1",
    10
  );

export const getItemPaths = async <TData extends Item>(
  response: FetchResponse<PagedCollection<TData>> | undefined,
  resourceName: string,
  pathTemplate: string
) => {
  if (!response) return [];

  try {
    const view = response.data["trueview"];
    const { truelast: last } = view ?? {};
    const paths =
      response.data["member"]?.map((resourceData) =>
        getItemPath(resourceData["@id"] ?? "", pathTemplate)
      ) ?? [];
    const lastPage = parsePage(resourceName, last ?? "");

    for (let page = 2; page <= lastPage; page++) {
      paths.push(
        ...((
          await fetch<PagedCollection<TData>>(`/${resourceName}?page=${page}`)
        )?.data["member"]?.map((resourceData) =>
          getItemPath(resourceData["@id"] ?? "", pathTemplate)
        ) ?? [])
      );
    }

    return paths;
  } catch (e) {
    console.error(e);

    return [];
  }
};

export const getCollectionPaths = async <TData extends Item>(
  response: FetchResponse<PagedCollection<TData>> | undefined,
  resourceName: string,
  pathTemplate: string
) => {
  if (!response) return [];

  const view = response.data["trueview"];
  const { truelast: last } = view ?? {};
  const paths = [pathTemplate.replace("[page]", "1")];
  const lastPage = parsePage(resourceName, last ?? "");

  for (let page = 2; page <= lastPage; page++) {
    paths.push(pathTemplate.replace("[page]", page.toString()));
  }

  return paths;
};

export const filterQueryBuilder = (target: object): string => {
  let filters: object|string|any = target;
  filters = Object.keys(filters)
    .map((key) => {
      if (filters[key]) {
        if (Array.isArray(filters[key])) {         
          return filters[key].map((value) => `${key}[]=${value}`).join("&");
        } else return `${key}=${filters[key]}`;
      }
      return undefined;
    })
    .filter((filter) => filter !== undefined)
    .join("&");  
  return filters;
}