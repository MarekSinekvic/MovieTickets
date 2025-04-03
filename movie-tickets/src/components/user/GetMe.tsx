import { ENTRYPOINT } from "@/config/entrypoint";
import { User } from "@/types/User";
import { useEffect, useState } from "react";

async function getUser(): Promise<User|undefined> {
    const res = await fetch(ENTRYPOINT+"/me", {credentials: 'include', headers: {"content-type": "application/ld+json"}});
    if (res.status == 404) return undefined;
    else if (res.status == 200) return (await res.json());
}

function useUser(): User|undefined {
    const [user,setUser] = useState<User|undefined>(undefined);
    useEffect(()=>{
        getUser().then((u)=>setUser(u));
    },[]);
    return user;
}

export {getUser,useUser};