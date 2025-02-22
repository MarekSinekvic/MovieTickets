import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Show } from "../../types/Show";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getShowsPath = (page?: string | string[] | undefined) =>
  `/shows${typeof page === "string" ? `?page=${page}` : ""}`;
export const getShows = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Show>>(getShowsPath(page));
const getPagePath = (path: string) => `/shows/page/${parsePage("shows", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: shows, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Show>> | undefined
  >(getShowsPath(page), getShows(page));
  const collection = useMercure(shows, hubURL);

  if (!collection || !collection["truemember"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Show List</title>
        </Head>
      </div>
      <List shows={collection["truemember"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
