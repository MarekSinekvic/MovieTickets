import { Media } from "@/types/Media";
import { Movie } from "@/types/Movie";
import { MouseEventHandler } from "react";
import GetMedia from "./GetMedia";


export default function MoviePreviewCard({name,preview,onClick} : {name:string|undefined, preview:Media, onClick?: MouseEventHandler}) {
    return (
        <>
            <div onClick={onClick} className="show-preview-card flex flex-wrap relative justify-center items-center rounded-md" style={{padding:'4px'}}>
                {/* <img src={preview} height={'auto'} style={{objectFit:'contain', height: '300px'}} className="rounded-md"/> */}
                {/* <GetMedia iri={preview}/> */}
                <img src={preview.file} height={'auto'} style={{objectFit:'contain', height: '300px'}} className="rounded-md"/>
                <div className="show-preview-card-wrapper flex flex-col justify-end px-2" style={{height: '300px'}}>
                    <div className="self-center text-xl">{name}</div>
                </div>
            </div>
        </>
    );
}