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

import { Form } from "@/components/ticket/Form";
import { PagedCollection } from "../../../types/collection";
import { Ticket } from "@/types/Ticket";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getTicket = async (id: string | string[] | undefined) =>
  id ? await fetch<Ticket>(`/tickets/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: ticket } = {} } = useQuery<
    FetchResponse<Ticket> | undefined
  >(["ticket", id], () => getTicket(id));

  if (!ticket) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{ticket && `Edit Ticket ${ticket["@id"]}`}</title>
        </Head>
      </div>
      <Form ticket={ticket} />
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
  const paths = await getItemPaths(response, "tickets", "/tickets/[id]/edit");

  return {
    paths,
    fallback: false,
  };
};

export default Page;
