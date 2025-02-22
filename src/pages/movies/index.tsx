import { GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getMovies,
  getMoviesPath,
} from "../../components/movie/PageList";
import Head from "next/head";
import Header from "@/components/Header";
import { useRouter } from "next/router";

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getMoviesPath(), getMovies());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export default function () {
  const navigator = useRouter();
  
  return (<>
  
    <div>
      <Head>
        <title>Show List</title>
      </Head>
    </div>
    <Header/>
    <PageList onClick={(v,i)=>{navigator.push('movies/'+v.id);}}/>
  </>)
};

