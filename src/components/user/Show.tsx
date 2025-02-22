import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

import ReferenceLinks from "../common/ReferenceLinks";
import { fetch, getItemPath } from "../../utils/dataAccess";
import { User } from "../../types/User";

import "@/app/globals.css";

interface Props {
  user: User;
  text: string;
}

const LinkStyle = "bg-cyan-500 hover:bg-cyan-700 text-white text-sm font-bold py-3 px-2 rounded";
export const Show: FunctionComponent<Props> = ({ user, text }) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (!user["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await fetch(user["@id"], { method: "DELETE" });
      router.push("/users");
    } catch (error) {
      setError("Error when deleting the resource.");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <Head>
        <title>{`Show User ${user["@id"]}`}</title>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </Head>
      <h1 className="text-3xl mb-2">{`Show User ${user["@id"]}`}</h1>
      <table
        cellPadding={10}
        className="shadow-md table border-collapse min-w-full leading-normal table-auto text-left my-3"
      >
        <thead className="uppercase" style={{ backgroundColor: "#ffffff33" }}>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-200">
          <tr>
            <th scope="row">uuid</th>
            <td>{user["uuid"]}</td>
          </tr>
          <tr>
            <th scope="row">roles</th>
            <td className="flex gap-2">{user["roles"]?.map((role)=><div>{role}</div>)}</td>
          </tr>
          <tr>
            <th scope="row">tickets</th>
            <td>
              <ReferenceLinks
                items={user["tickets"].map((ref: any) => ({
                  href: getItemPath(ref, "/tickets/[id]"),
                  name: ref,
                }))}
              />
            </td>
          </tr>
        </tbody>
      </table>
      {error && (
        <div
          className="border px-4 py-3 my-4 rounded text-red-700 border-red-400 bg-red-100"
          role="alert"
        >
          {error}
        </div>
      )}
      <div className="flex space-x-2 mt-4 items-center justify-end gap-4">
        <div className="flex flex-row items-center gap-1">
          <Link
            href={getItemPath(user["@id"], "/users/[id]/edit")}
            className="inline-block border-cyan-500 bg-cyan-500 hover:border-cyan-700 hover:bg-cyan-700 text-xs text-white font-bold py-3 px-2 rounded"
          >
            Edit
          </Link>
          <button
            className="bg-red-500"
            onClick={handleDelete}
          >
            Delete
          </button>
          {router.route === "/users/me" ? <button onClick={async ()=>{
            await fetch<unknown>("/logout", { method: "GET", credentials: 'include' });
            router.push("/");
          }} style={{backgroundColor: '#222288ff'}}>Logout</button> : ''}
        </div>
        <div className="flex flex-row gap-1">
          <Link href="/users" className="button">To list</Link>
          <Link href="/" className="button">To main</Link>
        </div>
      </div>
    </div>
  );
};