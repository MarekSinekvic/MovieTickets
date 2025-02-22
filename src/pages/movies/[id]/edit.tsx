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

import { Form } from "../../../components/movie/Form";
import { PagedCollection } from "../../../types/collection";
import { Movie } from "../../../types/Movie";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getMovie = async (id: string | string[] | undefined) =>
  id ? await fetch<Movie>(`/movies/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: movie } = {} } = useQuery<
    FetchResponse<Movie> | undefined
  >(["movie", id], () => getMovie(id));

  if (!movie) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{movie && `Edit Movie ${movie["@id"]}`}</title>
        </Head>
      </div>
      <Form movie={movie} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["movie", id], () => getMovie(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Movie>>("/movies");
  const paths = await getItemPaths(response, "movies", "/movies/[id]/edit");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
