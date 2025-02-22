import { ENTRYPOINT } from "@/config/entrypoint";
import { User } from "@/types/User";

async function getUser(): Promise<User|undefined> {
    const res = await fetch(ENTRYPOINT+"/me", {credentials: 'include', headers: {"content-type": "application/ld+json"}});
    if (res.status == 404) return undefined;
    else if (res.status == 200) return (await res.json());
}

export {getUser};