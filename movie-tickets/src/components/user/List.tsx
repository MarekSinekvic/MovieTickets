import { FunctionComponent, useRef } from "react";
import Link from "next/link";

import ReferenceLinks from "../common/ReferenceLinks";
import { getItemPath } from "../../utils/dataAccess";
import { User } from "../../types/User";

import "@/app/globals.css";
import { useRouter } from "next/router";

interface Props {
  users: User[];
}

const LinkStyle = "bg-cyan-500 hover:bg-cyan-700 text-white text-sm font-bold py-2 px-4 rounded";

export const List: FunctionComponent<Props> = ({ users }) => {
  const {push: route, query: {quuid}} = useRouter();
  const uuid = useRef<string|string[]|undefined>(quuid ?? undefined);
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl mb-2">User List</h1>
        <div className="flex gap-1">
          <Link href="/users/create" className={LinkStyle}>
            Create
          </Link>
          <Link href="/" className={LinkStyle}>Back</Link>
        </div>
      </div>
      <div className="flex gap-1"><input placeholder="UUID" defaultValue={quuid} onChange={(e)=>{uuid.current = e.target.value}}/><button onClick={()=>{(uuid.current != '' && typeof (uuid.current) != 'undefined') ? route('/users?uuid='+uuid.current) : route('/users')}}>Search</button></div>
      <table
        cellPadding={10}
        className="shadow-md table border-collapse min-w-full leading-normal table-auto text-left my-3"
      >
        <thead className="w-full text-xs uppercase py-2 px-4" style={{ backgroundColor: "#ffffff33" }}>
          <tr>
            <th>uuid</th>
            <th>roles</th>
            <th>tickets</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-200">
          {users &&
            users.length !== 0 &&
            users.map(
              (user) =>
                user["@id"] && (
                  <tr className="py-2" key={user["@id"]}>
                    <th scope="row">
                      <ReferenceLinks
                        items={{
                          href: getItemPath(user["@id"], "/users/[id]"),
                          name: user.uuid,
                        }}
                      />
                    </th>
                    <td>{user["roles"]?.join(',')}</td>
                    <td>
                      {user['tickets']?.map(ticket=><>
                        <div className="w-fit">{ticket.show?.movie?.name} </div>
                      </>)}
                    </td>
                  </tr>
                )
            )}
        </tbody>
      </table>
    </div>
  );
}