import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Show } from "../../types/Show";
import { fetch, FetchResponse, filterQueryBuilder, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getShowsPath = (
  page?: string | string[] | undefined,
  sort?: string | string[] | undefined,
  date?: string | string[] | undefined,
  tags?: string[] | undefined,
  name?: string | string[] | undefined
) => {
  const pageStr = (typeof page === "string" ? `page=${page}` : "");
  const sortStr = (typeof sort === "string" ? `order[${sort.split(':')[0]}]=${sort.split(':')[1]}` : "");
  const nameStr = (typeof name === "string" ? `movie.name=${name}` : "");
  const tagsStr = (Array.isArray(tags) ? (tags?.map((tag)=>{return `movie.tags[]=${tag}`}).join("&")) : "");
  // const query = filterQueryBuilder({page: page, sort: sort, date: date, tags: tags, name: name});
  
  
  if (pageStr == "" && sortStr == "" && nameStr == "" && tagsStr == "") return `/shows`;
  else return `/shows?${[pageStr,sortStr,nameStr,tagsStr].filter((v)=>{return v!==""}).join("&")}`;
}
export const getShows = (
  page?: string | string[] | undefined,
  sort?: string | string[] | undefined,
  date?: string | string[] | undefined,
  tags?: string[] | undefined,
  name?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Show>>(getShowsPath(page,sort,date,tags,name));
const getPagePath = (path: string) => `/shows?page=${parsePage("shows", path)}`;

export const PageList = ({onClick} : {onClick?: (v:Show,i:number)=>void}) => {
  const {
    query: { page, sort, date, 'tags[]': tags, name },
  } = useRouter();
  
  const { data: { data: shows, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Show>> | undefined
  >(getShowsPath(page, sort, date,tags,name), getShows(page, sort, date,tags,name)); // , {refetchOnMount: true}
  const collection = useMercure(shows, hubURL);

  if (!collection || !collection["member"]) return null;
  
  return (
    <div>
      <List shows={collection["member"]} onClick={onClick}/>
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
