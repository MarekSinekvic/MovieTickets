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

import { Show } from "../../../components/media/Show";
import { PagedCollection } from "../../../types/collection";
import { Media } from "../../../types/Media";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getMedia = async (id: string | string[] | undefined) =>
  id ? await fetch<Media>(`/media/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: media, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Media> | undefined>(["media", id], () =>
      getMedia(id)
    );
  const mediaData = useMercure(media, hubURL);

  if (!mediaData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Media ${mediaData["@id"]}`}</title>
        </Head>
      </div>
      <Show media={mediaData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["media", id], () => getMedia(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Media>>("/media");
  const paths = await getItemPaths(response, "media", "/medias/[id]");

  return {
    paths,
    fallback: false,
  };
};

export default Page;
