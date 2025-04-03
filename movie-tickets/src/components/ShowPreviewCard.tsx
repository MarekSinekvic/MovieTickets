import React, { MouseEventHandler } from "react";
import GetMedia from "@/components/GetMedia";
import { Tag } from "@/types/Tag";
import { Media } from "@/types/Media";


export default function ShowPreviewCard({preview, name = "", date='', tags=[], onClick}: {preview: Media, name?:string, date?:string,tags?:Tag[], onClick?: MouseEventHandler}) {    
    
    return (
     <div onClick={onClick} className="show-preview-card flex flex-wrap relative justify-center items-center rounded-md" style={{padding:'4px'}}>
      {/* <GetMedia iri={src}/> */}
      {preview && preview.file ? <img src={preview.file} height={'auto'} style={{objectFit:'contain', height: '300px'}} className="rounded-md"/> : ''}
      
      <div className="show-preview-card-wrapper flex flex-col justify-end px-2" style={{height: '300px'}}>
       <div className="self-center text-xl">{name}</div>
       <div className="flex justify-between text-xs">
         <div style={{width: "40%"}}>{new Date(date).toLocaleString()}</div>
         <div style={{width: "60%", flexWrap: 'wrap'}} className="flex flex-col items-end gap-0 max-w-52">{tags.slice(0,3).map((tag,i)=>{
          return <div key={i}>{tag.name}</div>;
         })}</div>
       </div>
      </div>
     </div>
    );
}