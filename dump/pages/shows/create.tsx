import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/show/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Show</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
