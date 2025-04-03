'use client'
import { useEffect, useState } from "react";
import "./Header.css";
import { BiCategory } from "react-icons/bi";
import SearchInput from "./SearchInput";
import Link from "next/link";
import { User } from "@/types/User";
import { getUser } from "./user/GetMe";

export default function Header({isAlwaysShown = false}: {isAlwaysShown?: boolean}) {
    const [headerOpacity,setHeaderOpacity] = useState(0);
    const [offset, setOffset] = useState(0);
    const [user, setUser] = useState<User|undefined>({});
    useEffect(()=>{
        if (!isAlwaysShown) {
            if (document.body.scrollHeight < window.innerHeight)
                setHeaderOpacity(1);
            else
                window.onscroll = (e)=>{
                    if (window.scrollY > 0) setHeaderOpacity(1);
                    else setHeaderOpacity(0);
                }
        } else setHeaderOpacity(1);
        getUser().then((user)=>{setUser(user)});
    },[]);
    return (
        <>
            <div className="header flex items-center gap-2 px-8 py-2" style={{opacity: headerOpacity, transition: '0.2s'}}>
                <div className="p-1">
                    <BiCategory size="30px" style={{backgroundColor: 'rgba(0,0,0,0.05)',borderRadius: '4px',padding: '4px'}}/>
                </div>
                <Link className="p-1 text-2xl" href="/">the Movies</Link>
                <div style={{marginLeft: '32px'}}>
                    {/* <SearchInput/> */}
                </div>
                <div style={{position:'absolute', right: '16px'}} className="flex gap-4 items-center">
                    <div>
                        {user?.roles?.includes("ROLE_ADMIN") ? <Link href="/tickets">Tickets</Link> : ''}
                    </div>
                    <div className="flex flex-col items-center">
                        <Link href="/shows">Shows</Link>
                        {user?.roles?.includes("ROLE_ADMIN") ? <Link href="/shows/create" className="text-xs hover:border-b">Create Show</Link> : ''}
                    </div>
                    <div className="flex flex-col items-center">
                        <Link href="/movies">Movies</Link>
                        {user?.roles?.includes("ROLE_ADMIN") ? <Link href="/movies/create" className="text-xs hover:border-b">Create Movie</Link> : ''}
                    </div>
                    {user ? (
                        <Link href="/users/me">
                            {user.uuid}
                        </Link>
                    ) : (<Link href={"/auth/login"}>Login</Link>)}
                </div>
            </div>
            <div>

            </div>
        </>
    );
}