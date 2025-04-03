import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

import { fetch, getItemPath } from "../../utils/dataAccess";
import { Movie } from "../../types/Movie";
import GetMedia from "../GetMedia";

import "@/app/globals.css";
import Header from "../Header";
import { useUser } from "../user/GetMe";

interface Props {
  movie: Movie;
  text: string;
}

export const Show: FunctionComponent<Props> = ({ movie, text }) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const user = useUser();

  return (
    <div className="">
      <Header isAlwaysShown={true}/>      
      <div className="mt-12 p-4">
        <div className="flex justify-center">
          {movie.media?.map((media, index) => <GetMedia iri={media} key={index}/>)}
        </div>
        <div className="flex flex-col items-center">
          <div>{movie.name}</div>
          <div className="flex gap-2 text-xs">{movie.tags?.map((tag,i)=>{
            return <div key={i}>{tag.name}</div>;
          })}</div>
        </div>
        <div className="px-8 mt-8">
          {movie.description}
        </div>
      </div>
      <div className="flex justify-end p-2 mr-4 mt-4 gap-1">
        {user && user.roles?.includes("ROLE_ADMIN") ? <Link className="button border border-cyan-400" href={router.asPath+"/edit"}>Edit</Link> : ''}
        <Link className="button" href="/movies">Back</Link>
        {movie.show ? (
          <Link className="button" href={'/shows/'+movie.show.split('/').at(-1)}>To the Show</Link>
        ) : ''}
      </div>
      <div className="w-full my-4" style={{background: 'radial-gradient(white 0%, black 80%)', height: '1px'}}></div>
      <div>
        {/* TODO: List of other related movies */}
      </div>

      {error && (
        <div
          className="border px-4 py-3 my-4 rounded text-red-700 border-red-400 bg-red-100"
          role="alert"
        >
          {error}
        </div>
      )}
      {/* <div className="flex space-x-2 mt-4 items-center justify-end">
        <Link
          href={getItemPath(movie["@id"], "/movies/[id]/edit")}
          className="inline-block mt-2 border-2 border-cyan-500 bg-cyan-500 hover:border-cyan-700 hover:bg-cyan-700 text-xs text-white font-bold py-2 px-4 rounded"
        >
          Edit
        </Link>
        <button
          className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-xs text-red-400 font-bold py-2 px-4 rounded"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div> */}
    </div>
  );
};
