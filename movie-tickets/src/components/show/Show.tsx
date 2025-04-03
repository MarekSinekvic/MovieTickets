import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

import ReferenceLinks from "../common/ReferenceLinks";
import { Show } from "../../types/Show";

import "./../../app/globals.css";
import GetMedia from "../GetMedia";
import { ENTRYPOINT } from "@/config/entrypoint";
import Header from "../Header";
import { useUser } from "../user/GetMe";
import { getPathMatch } from "next/dist/shared/lib/router/utils/path-match";

interface Props {
  show: Show;
  text: string;
}

function Tag({children}: {children:React.ReactNode}) {

  return (
    <div className="text-gray-200 text-xs">
      {children}
    </div>
  );
}
async function getTicket(show: Show, client: string|undefined): Promise<string> {
  const router = useRouter();
  if (!client) {
    router.push("/auth/login")
    // throw new Error("Wrong client");
  }
  const res = await fetch(ENTRYPOINT+'/tickets', {
    method: 'post',
    headers: {
      'content-type': 'application/ld+json'
    },
    body: JSON.stringify({
      "show": show["@id"],
      "client": client
    })
  });

  return (await res.json())["@id"];
}

// TODO: Add actors with roles, country ...
export const Show: FunctionComponent<Props> = ({ show, text }) => {
  const router = useRouter();
  const [orderModal, setOrderModal] = useState<boolean>(false);
  const [orderCode, setOrderCode] = useState<number|null>(null);
  const user = useUser(); 


  return (
    <>
      <Header isAlwaysShown={true}/>
      {orderModal ? (
        <div className="fixed left-0 top-0 w-full h-full  flex justify-center items-center backdrop-blur-sm">
          <div style={{backgroundColor: "rgba(255,255,255,0.15)", padding: "16px 32px"}} className="rounded-md flex flex-col gap-2 min-w-52">
              <div className="flex flex-row justify-between mb-4">
                <div>Order</div>
                <button style={{padding: 0, width: '24px', height: '24px'}} onClick={()=>{setOrderModal(false)}}>x</button>
              </div>
              <div>
                <div className="flex flex-col gap-1">
                  <div className="w-full"><input type="text" placeholder="Email" className="w-full"/></div>
                  <div><input placeholder="Name on card" style={{width: "70%"}}/> <input placeholder="End date" style={{width: "29%"}}/></div>
                  <div><input placeholder="Card Number" style={{width: "80%"}}/> <input placeholder="Secure code" style={{width: "19%"}}/></div>
                </div>
              </div>
              <div className="flex flex-col">
                <button onClick={()=>{getTicket(show, user?.["@id"]).then((id)=>{setOrderCode(id)})}}>Make payment</button>
                <div className="flex flex-col items-center">
                  {orderCode ? (
                    <>
                      <div className="text-xs">Your order code, please remember it, also it will be sended to your email: </div>
                      <div className="text-lg">{orderCode}</div>
                    </>
                  ) : ''}
                </div>
              </div>
          </div>
        </div>
      ) : (<></>)}
      <div className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-center items-center p-4">
            {/* <img src="/1.jpg" style={{height: "300px", transform: "translate(40px,20px)"}}/>
            <img src="/2.jpg" style={{height: "400px", zIndex: 1}}/>
            <img src="/3.jpg" style={{height: "300px", transform: "translate(-40px,20px)"}}/> */}
            {show.movie?.media?.map((m,i)=>{              
              if (m)
                return <GetMedia iri={m['@id']}/>;
            })}
          </div>
          <div className="flex flex-col items-center">
            <div className="text-4xl">{show.movie?.name}</div>
            <div className="flex flex-col items-center">
              <div>{(show.begin_date) ? show.begin_date : ''}</div>
              <div style={{marginTop: '-4px', fontSize: '10px'}}>({show.end_date})</div>
            </div>
          </div>
          <div className="flex justify-between mt-8">
            <div style={{width: '50%'}} className="flex flex-col justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  {show.movie?.tags?.map((tag,i)=>{
                    return (<Tag>{tag.name}</Tag>);
                  })}
                  {/* <Tag>Dramatic</Tag>
                  <Tag>Horror</Tag>
                  <Tag>Thriller</Tag> */}
                </div>
                <div className="text-wrap">{show.movie?.description}</div>
                <div>
                  Movie rating
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-1">
                  <Tag>1123</Tag> <Tag>1222</Tag> <Tag>8966</Tag> <Tag>1232</Tag>
                  <Tag>1123</Tag> <Tag>1222</Tag> <Tag>8966</Tag> <Tag>1232</Tag>
                  <Tag>1123</Tag> <Tag>1222</Tag> <Tag>8966</Tag> <Tag>1232</Tag>
                  <Tag>1123</Tag> <Tag>1222</Tag> <Tag>8966</Tag> <Tag>1232</Tag>
                  <Tag>1123</Tag> <Tag>1222</Tag> <Tag>8966</Tag> <Tag>1232</Tag>
                  <Tag>1123</Tag> <Tag>1222</Tag> <Tag>8966</Tag> <Tag>1232</Tag>
                  <Tag>1123</Tag> <Tag>1222</Tag> <Tag>8966</Tag> <Tag>1232</Tag>
                  <Tag>1123</Tag> <Tag>1222</Tag> <Tag>8966</Tag> <Tag>1232</Tag>
                  <Tag>... (about 1801 tickets)</Tag>
                </div>
                <button type="button" style={{border: '1px solid gray', borderRadius: '4px', padding: '4px 8px'}} onClick={()=>{setOrderModal(true)}}>Order ticket</button>
                {user && user.roles?.includes("ROLE_ADMIN") ? <Link className="button border border-cyan-400" href={router.asPath+"/edit"}>Edit</Link> : ''}
              </div>
            </div>
            <div style={{width: '400px',height:'400px',border:'1px solid gray', borderRadius: '4px'}}>
              Theaters map
            </div>
          </div>
          <div className="w-full my-4" style={{background: 'radial-gradient(white 0%, black 80%)', height: '1px'}}></div>
          <div>
            List of other related shows
          </div>
        </div>
      </div>
    </>
  );
};
