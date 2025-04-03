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

import { Show as ShowRel } from "../../../components/show/Show";
import { PagedCollection } from "../../../types/collection";
import { Show } from "../../../types/Show";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getShow = async (id: string | string[] | undefined) =>
  id ? await fetch<Show>(`/shows/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: show, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Show> | undefined>(["show", id], () => getShow(id));
  const showData = useMercure(show, hubURL);

  if (!showData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Show ${showData["@id"]}`}</title>
        </Head>
      </div>
      <ShowRel show={showData} text={text} />
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
  const paths = await getItemPaths(response, "shows", "/shows/[id]");

  return {
    paths,
    fallback: false,
  };
};

export default Page;
