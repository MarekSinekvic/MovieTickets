import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getMovies,
  getMoviesPath,
} from "../../../components/movie/PageList";
import { PagedCollection } from "../../../types/collection";
import { Movie } from "../../../types/Movie";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getMoviesPath(page), getMovies(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Movie>>("/movies");
  const paths = await getCollectionPaths(
    response,
    "movies",
    "/movies/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
