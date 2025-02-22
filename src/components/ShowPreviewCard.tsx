import React, { MouseEventHandler } from "react";
import GetMedia from "@/components/GetMedia";
import { Tag } from "@/types/Tag";


export default function ShowPreviewCard({src, name = "", date='', tags=[], onClick}: {src: string, name?:string, date?:string,tags?:Tag[], onClick?: MouseEventHandler}) {    
    return (
     <div onClick={onClick} className="show-preview-card flex flex-wrap relative justify-center items-center rounded-md" style={{padding:'4px'}}>
      {/* <img src={src} height={'auto'} style={{objectFit:'contain', height: '300px'}} className="rounded-md"/> */}
      <GetMedia iri={src}/>
      <div className="show-preview-card-wrapper flex flex-col justify-end px-2" style={{height: '300px'}}>
       <div className="self-center text-xl">{name}</div>
       <div className="flex justify-between text-xs">
         <div>{date}</div>
         <div className="flex flex-row gap-2 max-w-52">{tags.map((tag,i)=>{
          return <div key={i}>{tag.name}</div>;
         })}</div>
       </div>
      </div>
     </div>
    );
}