import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { User } from "../../types/User";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getUsersPath = (page?: string | string[] | undefined, uuid?: string | string[] | undefined) => {
  if (typeof (page) == "undefined" && typeof (uuid) == "undefined")
    return `/users`;
  else
    return `/users?${page ? `page=${page}&` : ''}${uuid ? `uuid=${uuid}` : ''}`;
}
export const getUsers = (page?: string | string[] | undefined, uuid?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<User>>(getUsersPath(page,uuid));
const getPagePath = (path: string) => `/users/page/${parsePage("users", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page, uuid },
  } = useRouter();
  
  const { data: { data: users, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<User>> | undefined
  >(getUsersPath(page,uuid), getUsers(page,uuid));
  const collection = useMercure(users, hubURL);

  if (!collection || !collection["member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>User List</title>
        </Head>
      </div>
      <List users={collection["member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
