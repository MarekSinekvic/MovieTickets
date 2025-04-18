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

import { Form } from "../../../components/show/Form";
import { PagedCollection } from "../../../types/collection";
import { Show } from "../../../types/Show";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getShow = async (id: string | string[] | undefined) =>
  id ? await fetch<Show>(`/shows/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: show } = {} } = useQuery<
    FetchResponse<Show> | undefined
  >(["show", id], () => getShow(id));

  if (!show) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{show && `Edit Show ${show["@id"]}`}</title>
        </Head>
      </div>
      <Form show={show} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["show", id], () => getShow(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Show>>("/shows");
  const paths = await getItemPaths(response, "shows", "/shows/[id]/edit");

  return {
    paths,
    fallback: false,
  };
};

export default Page;
