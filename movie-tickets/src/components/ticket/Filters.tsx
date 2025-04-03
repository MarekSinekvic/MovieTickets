import { filterQueryBuilder } from "@/utils/dataAccess";
import { useRouter } from "next/router";
import { MutableRefObject, useRef } from "react";


export const IdFilter = ({id, defaultValue} : {id: MutableRefObject<string | string[] | undefined>, defaultValue: string|string[]|undefined}) => {
    return (
        <>
            <input placeholder="ID" defaultValue={defaultValue} onChange={(e)=>{id.current=e.target.value}}/>
        </>
    );
}
export const ClientFilter = ({client, defaultValue}: {client: MutableRefObject<string | string[] | undefined>, defaultValue: string|string[]|undefined}) => {
    return (
        <>
            <input placeholder="Client" defaultValue={defaultValue} onChange={(e)=>{client.current=e.target.value}}/>
        </>
    );
}
export const ShowFilter = ({show, defaultValue}: {show: MutableRefObject<string | string[] | undefined>, defaultValue: string|string[]|undefined}) => {
    return (
        <>
            <input placeholder="Show" defaultValue={defaultValue} onChange={(e)=>{show.current=e.target.value}}/>
        </>
    );
}

const FiltersBlock = () => {
    const {push: route, query: { id: queryId, client: queryClient, show: queryShow, page }} = useRouter();
    const id = useRef(queryId);
    const client = useRef(queryClient);
    const show = useRef(queryShow);
    
    return (
        <div className="flex gap-1">
            <IdFilter id={id} defaultValue={queryId}/>
            <ShowFilter show={show} defaultValue={queryShow}/>
            <ClientFilter client={client} defaultValue={queryClient}/>
            <button onClick={()=>{ //${page ? '/page/'+Number(page) : ''}
                route(`/tickets/page/1?${filterQueryBuilder({id: id.current, client: client.current, show: show.current})}`);
            }}>Search</button>
        </div>
    );
} 
export default FiltersBlock;