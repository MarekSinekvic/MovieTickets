import { FunctionComponent, useState } from "react";
import Link from "next/link";

import ReferenceLinks from "../common/ReferenceLinks";
import { getItemPath } from "../../utils/dataAccess";
import { Ticket } from "../../../src/types/Ticket";
import FiltersBlock from "./Filters";
import { useRouter } from "next/router";

interface Props {
  tickets: Ticket[];
}

export const List: FunctionComponent<Props> = ({ tickets }) => {
  const router = useRouter();  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl mb-2">Ticket List</h1>
      </div>
      <div className="flex justify-between">
        <FiltersBlock/>
        <button onClick={()=>router.push("/")}>Back</button>
      </div>
      <table
        cellPadding={10}
        className="shadow-md table border-collapse min-w-full leading-normal table-auto text-left my-3"
      >
        <thead className="uppercase">
          <tr>
            <th>id</th>
            <th>show</th>
            <th>client</th>
          </tr>
        </thead>
        <tbody className="">
          {tickets &&
            tickets.length !== 0 &&
            tickets.map(
              (ticket) =>
                ticket["@id"] && (
                  <tr className="py-2" key={ticket["@id"]}>
                    <th scope="row">
                      <ReferenceLinks
                        items={{
                          href: getItemPath(ticket["@id"], "/tickets/[id]"),
                          name: ticket.id,
                        }}
                      />
                    </th>
                    <td>
                      {ticket.show ? (<><ReferenceLinks
                        items={{
                          href: getItemPath(ticket.show['@id'], "/show/[id]"),
                          name: ticket.show?.movie?.name,
                        }}
                      />({ticket.show?.begin_date})</>) : ''}
                    </td>
                    <td>
                      {ticket.client ? (<>
                        <ReferenceLinks
                          items={{
                            href: getItemPath(ticket.client['@id'], "/users/[id]"),
                            name: ticket.client?.uuid,
                          }}
                        />
                      </>) : ''}
                    </td>
                  </tr>
                )
            )}
        </tbody>
      </table>
    </div>
  );
};
