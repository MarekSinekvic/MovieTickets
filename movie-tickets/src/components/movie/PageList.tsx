import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Movie } from "../../types/Movie";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getMoviesPath = (
  page?: string | string[] | undefined,
  sort?: string | string[] | undefined,
  date?: string | string[] | undefined,
  tags?: string[] | undefined,
  name?: string | string[] | undefined
) => {
  const pageStr = (typeof page === "string" ? `page=${page}` : "");
  const sortStr = (typeof sort === "string" ? `order[${sort.split(':')[0]}]=${sort.split(':')[1]}` : "");
  const nameStr = (typeof name === "string" ? `name=${name}` : "");
  if (tags && !Array.isArray(tags))
    tags = [tags];
  const tagsStr = tags ? (tags?.map((tag)=>{return `tags[]=${tag}`}).join("&")) : '';
  
  if (pageStr == "" && sortStr == "" && nameStr == "" && tagsStr == "") return `/movies`;
  else return `/movies?${[pageStr,sortStr,nameStr,tagsStr].filter((v)=>{return v!==""}).join("&")}`;
}
export const getMovies = (
  page?: string | string[] | undefined,
  sort?: string | string[] | undefined,
  date?: string | string[] | undefined,
  tags?: string[] | undefined,
  name?: string | string[] | undefined
) => async () =>
  await fetch<PagedCollection<Movie>>(getMoviesPath(page, sort,date,tags,name));
const getPagePath = (path: string) =>
  `/movies?page=${parsePage("movies", path)}`;

export const PageList = ({onClick} : {onClick?: (v:Movie,i:number)=>void}) => {
  const {
    query: { page, sort, date, 'tags[]': tags, name },
  } = useRouter();
  const { data: { data: movies, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Movie>> | undefined
  >(getMoviesPath(page, sort,date,tags,name), getMovies(page, sort,date,tags,name));
  const collection = useMercure(movies, hubURL);

  if (!collection || !collection["member"]) return null;

  return (
    <div>
      <List movies={collection["member"]} onClick={onClick}/>
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
