import { FunctionComponent } from "react";

import { Movie } from "../../types/Movie";
import MoviePreviewCard from "../MoviePreviewCard";
import FiltersBlock from "../filters/FiltersBlock";

interface Props {
  movies: Movie[];
  onClick?: (v:Movie,i:number)=>void
}

export const List: FunctionComponent<Props> = ({ movies, onClick = ()=>{} }) => (
  <div className="mt-16">
    <FiltersBlock/>
    <div className="flex flex-wrap overflow-auto justify-center">
      {Array.isArray(movies) && movies.map((v,i)=>{return (
        <MoviePreviewCard key={i} preview={v.preview} onClick={()=>{onClick(v,i)}} name={v?.name}/>
      )})}
    </div>
  </div>
);

