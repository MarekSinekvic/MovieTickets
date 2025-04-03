import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getMedias,
  getMediasPath,
} from "../../../components/media/PageList";
import { PagedCollection } from "../../../types/collection";
import { Media } from "../../../types/Media";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getMediasPath(page), getMedias(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Media>>("/media");
  const paths = await getCollectionPaths(
    response,
    "media",
    "/medias/page/[page]"
  );

  return {
    paths,
    fallback: false,
  };
};

export default PageList;
