import {
  GetStaticPaths,
  GetStaticProps,
  NextComponentType,
  NextPageContext,
} from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { Show } from "@/components/ticket/Show";
import { PagedCollection } from "../../../types/collection";
import { Ticket } from "@/types/Ticket";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getTicket = async (id: string | string[] | undefined) =>
  id ? await fetch<Ticket>(`/tickets/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: ticket, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Ticket> | undefined>(["ticket", id], () =>
      getTicket(id)
    );
  const ticketData = useMercure(ticket, hubURL);

  if (!ticketData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Ticket ${ticketData["@id"]}`}</title>
        </Head>
      </div>
      <Show ticket={ticketData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["ticket", id], () => getTicket(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Ticket>>("/tickets");
  const paths = await getItemPaths(response, "tickets", "/tickets/[id]");

  return {
    paths,
    fallback: false,
  };
};

export default Page;
