import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getTickets,
  getTicketsPath,
} from "@/components/ticket/PageList";
import { PagedCollection } from "../../../types/collection";
import { Ticket } from "@/types/Ticket";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getTicketsPath(page), getTickets(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Ticket>>("/tickets");
  const paths = await getCollectionPaths(
    response,
    "tickets",
    "/tickets/page/[page]"
  );

  return {
    paths,
    fallback: false,
  };
};

export default PageList;
