import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import SelectButton from "../common/SelectButton";
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import "./filters.css";

export default function SortSelector({onApply = undefined, defaultValue = undefined, ref = undefined, items = []} : {onApply?: Dispatch<SetStateAction<string|string[]>>, defaultValue?: string|string[], ref?: MutableRefObject<string|string[]|undefined>, items?: string[]}) {
    const [isShown, setShown] = useState(false);
    const sortQuery = useRef<{name:string|undefined,direction:string|undefined}>({name:defaultValue?.split(':')[0] ?? undefined, direction:defaultValue?.split(':')[1] ?? undefined});
    const router = useRouter();
    const setSort = (name: string, direction:string|undefined = undefined) => {
      let query = "";
      if (!direction) {
        query = (`sort=${name}:${sortQuery.current.direction == "asc" ? "desc" : "asc"}`);
        direction = sortQuery.current.direction == "asc" ? "desc" : "asc";
      } else query = (`sort=${name}:${direction}`);
      
      if (ref)
        ref.current = `${name}:${direction}`;

      if (onApply) onApply(`${name}:${direction}`);
      else router.push('?'+query);
    }
    // console.log(sortQuery.current);
    
    return (
      <>
        <div className="flex flex-col"> 
          {/* colorize on selected value, green / red */}
          <button onClick={()=>sortQuery.current.name ? setSort(sortQuery.current.name,"asc") : ''} className="p-0"><MdKeyboardArrowUp color={sortQuery.current.direction == 'asc' ? 'green' : ''}/></button>
          <button onClick={()=>sortQuery.current.name ? setSort(sortQuery.current.name,"desc") : ''} className="p-0"><MdKeyboardArrowDown color={sortQuery.current.direction == 'desc' ? 'red' : ''}/></button>
        </div>
        <SelectButton onClick={()=>{setShown(!isShown)}}>Sort</SelectButton>
        {isShown ? (
          <div className="absolute top-full right-0 z-20 flex flex-col w-fit filterMenu" style={{width: '100px', opacity:1}}>
            {items.map((item)=>{
              return <div className="flex gap-1"><input type="radio" name="sort" onChange={()=>setSort(item)} defaultChecked={((defaultValue && defaultValue.split(':')[0] == item) ? true : false)}/>{item}</div>
            })}
          </div>
        ):''}
      </>
    );
  }