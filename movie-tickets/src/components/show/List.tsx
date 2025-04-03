import { FunctionComponent, MouseEventHandler } from "react";

import { Show } from "../../types/Show";

import "./../../app/globals.css";
import ShowPreviewCard from "../ShowPreviewCard";
import FiltersBlocks from "../filters/FiltersBlock";

interface Props {
  shows: Show[],
  onClick?: (v: Show,i: number) => void
  // sortSetter : Dispatch<SetStateAction<string>>,
  // filterSetter: Dispatch<SetStateAction<object>>
}

export const List: FunctionComponent<Props> = ({ shows, onClick = ()=>{} }) => {
  
  return (
    <div className="mt-16">
      <FiltersBlocks/>
      <div className="flex flex-wrap overflow-auto justify-center">
        {Array.isArray(shows) && shows.map((v,i)=>{return (
          <ShowPreviewCard key={i} preview={v.movie?.preview} tags={v.movie?.tags} onClick={()=>{onClick(v,i)}} name={v?.movie?.name} date={v?.end_date?.toLocaleString()}/>
        )})}
      </div>
    </div>
  );
}
