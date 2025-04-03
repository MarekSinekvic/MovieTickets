import { User } from "@/types/User";
import { fetch, FetchResponse } from "@/utils/dataAccess";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

import "@/app/globals.css";
import Header from "@/components/Header";
import { Show } from "@/components/user/Show";
import { useMercure } from "@/utils/mercure";

const getUser = async () => await fetch<User>(`/me`,{credentials: 'include'});

export default function Me() {
    const router = useRouter();

    const { data: { data: user, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<User> | undefined>('', () => getUser(), {onError: (error) => {router.push('/auth/login');}});
    const userData = useMercure(user, hubURL);
    
    
    return (
        <>
            {userData ? <Show user={userData} text={text}/> : ''}
        </>
    );
}