import React, { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import SelectButton from "../common/SelectButton";

import "./filters.css";
import { Field } from "formik";
import { Tag } from "@/types/Tag";
import { ENTRYPOINT } from "@/config/entrypoint";
import Link from "next/link";

export default function TagsSelector({isFilter = true, onApply = undefined, defaultValue = [], ref = undefined} : {isFilter?:boolean, onApply?: ()=>void, defaultValue?: string[], ref?: MutableRefObject<string[]|undefined>}) {
    const [isExpanded, expand] = useState<boolean>(false);
    const [tags,setTags] = useState<Tag[]>([]);
    const checked = useRef<boolean[]>([]);
    const newTagName = useRef<HTMLInputElement>(null);
  
    const Tag = ({children, id,onDelete=()=>{}}:{children:React.ReactNode, id:string, onDelete: ()=>void}) => {
      return (
        <div className="flex gap-1 p-2 items-center" style={{backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "10%"}}>
          <button style={{padding: 0, width: "20px", height: "20px"}} className="flex justify-center items-center" onClick={onDelete} type="button">x</button>
          {isFilter ? (<input type="checkbox" defaultChecked={defaultValue.includes(id.split('/').at(-1))} onChange={(e)=>{
            if (!ref?.current) return;
            if (!Array.isArray(ref?.current)) ref.current = [ref?.current];
            const ind = ref?.current.findIndex((v)=>v==id.split('/').at(-1));
            if (ind == -1) ref?.current.push(id.split('/').at(-1));
            else ref?.current.splice(ind,1);
            if (onApply)
              onApply();
          }}/>) : (<Field type="checkbox" name="tags" value={id}/>)}
          {children}
        </div>
      );
    }
    async function UpdateTags() {
      const res = await fetch(ENTRYPOINT+"/tags");
      setTags((await res.json()).member);
    }
    useEffect(()=>{
      UpdateTags();
    },[]);
    
    return (
      <div className="relative">
        <div>
          <SelectButton onClick={()=>{expand(!isExpanded)}}>Tags</SelectButton>
        </div>
        <div style={{transition: '0.2s', display: isExpanded ? 'flex' : 'none'}} className="gap-6 filterMenu flex flex-col">
          <div>
            <input placeholder="Search" className="w-full"/>
          </div>
          <div className="flex gap-2 flex-wrap">
            {tags ? tags.map((tag,i)=>{
              if (!tag["@id"]) return <React.Fragment key={i}></React.Fragment>;
                  return <Tag id={tag["@id"]} key={i} onDelete={()=>{
                    (async ()=>{                    
                      await fetch(ENTRYPOINT+tag["@id"]?.slice(4),{
                        method: "delete"
                      });
                      UpdateTags();
                    })();
                }}>{tag.name}</Tag>;
            }) : ''}
          </div>
          <div className="flex flex-row gap-1">
            <input placeholder="Create new tag" ref={newTagName}/>
            <button type="button" onClick={(e)=>{              
              (async ()=>{
                await fetch(ENTRYPOINT+"/tags", {
                  method:"post", 
                  headers: {"Content-Type": "application/ld+json"},
                  body: JSON.stringify({
                    name: newTagName.current?.value,
                    movie: []
                })});
                UpdateTags();
              })();
            }}>Add</button>
          </div>
        </div> 
      </div>
    );
  }