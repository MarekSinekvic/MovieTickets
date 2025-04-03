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

import { Form } from "../../../components/media/Form";
import { PagedCollection } from "../../../types/collection";
import { Media } from "../../../types/Media";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getMedia = async (id: string | string[] | undefined) =>
  id ? await fetch<Media>(`/media/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: media } = {} } = useQuery<
    FetchResponse<Media> | undefined
  >(["media", id], () => getMedia(id));

  if (!media) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{media && `Edit Media ${media["@id"]}`}</title>
        </Head>
      </div>
      <Form media={media} />
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
  const paths = await getItemPaths(response, "media", "/medias/[id]/edit");

  return {
    paths,
    fallback: false,
  };
};

export default Page;
