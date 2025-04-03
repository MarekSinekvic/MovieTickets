import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/movie/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Movie</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
