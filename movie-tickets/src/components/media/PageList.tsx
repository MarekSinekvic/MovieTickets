import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Media } from "../../types/Media";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getMediasPath = (page?: string | string[] | undefined) =>
  `/media${typeof page === "string" ? `?page=${page}` : ""}`;
export const getMedias = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Media>>(getMediasPath(page));
const getPagePath = (path: string) =>
  `/medias?page=${parsePage("media", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: medias, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Media>> | undefined
  >(getMediasPath(page), getMedias(page));
  const collection = useMercure(medias, hubURL);

  if (!collection || !collection["member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Media List</title>
        </Head>
      </div>
      <List medias={collection["member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
