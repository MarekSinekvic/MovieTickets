import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Ticket } from "../../../src/types/Ticket";
import { fetch, FetchResponse, filterQueryBuilder, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

import "./../../app/globals.css";

export const getTicketsPath = (page?: string | string[] | undefined, id?: string | string[] | undefined, client?: string | string[] | undefined, show?: string | string[] | undefined) => {
  return (!page && !id && !client && !show) ? `/tickets` : `/tickets?${filterQueryBuilder({page, id, 'client.uuid':client, 'show.movie.name':show})}`;
}
export const getTickets = (page?: string | string[] | undefined, id?: string | string[] | undefined, client?: string | string[] | undefined, show?: string | string[] | undefined) => async () => {
  return await fetch<PagedCollection<Ticket>>(getTicketsPath(page, id, client,show));
}
const getPagePath = (path: string) =>
  `/tickets/page/${parsePage("tickets", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page, id, client,show },
  } = useRouter();
  const { data: { data: tickets, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Ticket>> | undefined
  >(getTicketsPath(page,(id),client,show), getTickets(page,(id),client,show));
  const collection = useMercure(tickets, hubURL);

  if (!collection || !collection["member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Ticket List</title>
        </Head>
      </div>
      <List tickets={collection["member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
