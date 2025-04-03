import { Form } from "@/components/ticket/Form";
import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";


const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Ticket</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
