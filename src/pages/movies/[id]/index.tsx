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

import { Show } from "../../../components/movie/Show";
import { PagedCollection } from "../../../types/collection";
import { Movie } from "../../../types/Movie";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getMovie = async (id: string | string[] | undefined) =>
  id ? await fetch<Movie>(`/movies/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: movie, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Movie> | undefined>(["movie", id], () =>
      getMovie(id)
    );
  const movieData = useMercure(movie, hubURL);

  if (!movieData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Movie ${movieData["@id"]}`}</title>
        </Head>
      </div>
      <Show movie={movieData} text={text} />
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
  const paths = await getItemPaths(response, "movies", "/movies/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
