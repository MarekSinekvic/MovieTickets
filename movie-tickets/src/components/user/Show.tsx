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
      <div>
        <div style={{fontSize: "20px"}}>User {user.uuid}</div>
        <div>
          <div>Your tickets</div>
          <div>
            <table className="w-full">
              <thead>
                <tr>
                  <td>Identifier</td>
                  <td>Movie name</td>
                  <td>Date</td>
                  <td>Seat Number</td>
                  <td>Actions</td>
                </tr>
              </thead>
              <tbody>
                {user.tickets?.map((ticket, index) => (<>
                  <tr>
                    <td>{ticket["@id"]}</td>
                    <td>{ticket.show?.movie?.name}</td>
                    <td>{ticket.show?.begin_date}</td>
                    <td>{ticket.show?.seat}</td>
                    <td>Action</td>
                  </tr>
                </>))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
          {user.roles?.includes("ROLE_ADMIN") ? (<button
            className="bg-red-500"
            onClick={handleDelete}
          >
            Delete
          </button>) : ''}
          {router.route === "/users/me" ? <button onClick={async ()=>{
            await fetch<unknown>("/logout", { method: "GET", credentials: 'include' });
            router.push("/");
          }} style={{backgroundColor: '#222288ff'}}>Logout</button> : ''}
        </div>
        <div className="flex flex-row gap-1">
          {user.roles?.includes("ROLE_ADMIN") ? <Link href="/users" className="button">To users list</Link> : ''}
          <Link href="/" className="button">To main</Link>
        </div>
      </div>
    </div>
  );
};