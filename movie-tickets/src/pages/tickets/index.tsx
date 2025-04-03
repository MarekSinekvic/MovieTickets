import { getTickets, getTicketsPath, PageList } from "@/components/ticket/PageList";
import { GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";


export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getTicketsPath(), getTickets());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export default PageList;
