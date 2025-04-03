import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/media/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Media</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
