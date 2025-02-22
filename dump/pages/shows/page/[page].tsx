import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getShows,
  getShowsPath,
} from "../../../components/show/PageList";
import { PagedCollection } from "../../../types/collection";
import { Show } from "../../../types/Show";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getShowsPath(page), getShows(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Show>>("/shows");
  const paths = await getCollectionPaths(
    response,
    "shows",
    "/shows/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
