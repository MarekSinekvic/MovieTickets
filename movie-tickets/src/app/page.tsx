'use client'
import { MouseEventHandler, useEffect, useState } from "react";
import "./globals.css";
import Header from "@/components/Header";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowDown } from "react-icons/md";
import { useRouter } from "next/navigation";
import ShowPreviewCard from "@/components/ShowPreviewCard";
import Link from "next/link";
import { Show } from "@/types/Show";
import { ENTRYPOINT } from "@/config/entrypoint";
import TagsSelector from "@/components/filters/TagsSelector";
import FiltersBlock from "@/components/filters/FiltersBlock";

const FiltersStyle:any = {
  position: 'absolute',
  backdropFilter: 'blur(4px)', 
  background: 'rgba(0,0,0,0.3)', 
  borderRadius: '8px', 
  borderBottom: '1px solid black',
  borderTop: '1px solid black',
  zIndex: 20,
  display: 'flex',
  padding: '16px'
};

function SelectButton({children, onClick} : {children: React.ReactNode,onClick?:MouseEventHandler}) {
  return (
    <>
      <button style={{backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px 16px',borderRadius: '4px'}}
                  onClick={onClick}>{children}</button>
    </>
  );
}
function DatesSelector() {
  const [isExpanded, expand] = useState<boolean>(false);
  return (
    <div>
      <div>
        <SelectButton onClick={()=>{expand(!isExpanded)}}>Dates</SelectButton>
      </div>
    </div>
  );
}
function SortSelector({sortSetter} : {sortSetter: Function}) {
  const [isShown, setShown] = useState(false);
  return (
    <>
      <SelectButton onClick={()=>{setShown(!isShown)}}>Sort</SelectButton>
      {isShown ? (
        <div className="absolute top-full right-0 z-20 flex flex-col w-fit" style={{...FiltersStyle, width: '100px', opacity:1}}>
          <div className="flex gap-1"><input type="radio" name="sort" defaultChecked onChange={()=>sortSetter("Date")}/>Date</div>
          <div className="flex gap-1"><input type="radio" name="sort" onChange={()=>sortSetter("Name")}/>Name</div>
          <div className="flex gap-1"><input type="radio" name="sort" onChange={()=>sortSetter("Views")}/>Views</div>
          <div className="flex gap-1"><input type="radio" name="sort" onChange={()=>sortSetter("Likes")}/>Likes</div>
        </div>
      ):''}
    </>
  );
}

export default function Home() {
  const router = useRouter();
  const [shows, setShows] = useState<Show[]>([]);
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [sort,setSort] = useState<string>("");
  const [filter,setFilter] = useState();
  useEffect(()=>{
    window.onload = () => {
      setLoaded(true);
    }
    (async ()=>{
      const res = await fetch(ENTRYPOINT+"/shows?itemsPerPage=10");
      if (res.status == 200) {
        const data = (await res.json());
        setShows(data.member);
      }
    })();
  },[]);
  return (
    /*<div>
      <form method="post" action={"http://localhost:8000/media/create"} encType="multipart/form-data">
        <input type="file" name="images[]" multiple/>
        <button type="submit">Send</button>
      </form>
    </div>*/
    <>
      <Header/>
      {/* <LoadingScreen isLoading={isLoaded}/> */}
      <div>
        <div>
          <div className="back-video-wrapper"></div>
          <video src="/10.mp4" className="back-video h-screen w-screen" autoPlay loop></video>
        </div>
        <div className="h-screen flex justify-center items-center relative">
          <div className="absolute left-0 z-10 overflow-clip">
          </div>
          <span className="text-8xl z-10 text-white p-8 w-full text-center" style={{backgroundColor: "#00000033"}}>
            The Movies
          </span>
          <div className="absolute right-0 z-10 overflow-clip">
          </div>
        </div>
        <div style={{background: 'linear-gradient(0deg,rgba(0,0,0,0) 0%, rgba(6,6,6,1) 80%)', height: '50px', width: '100%'}} className="absolute"></div>
          <div className="flex flex-col h-screen p-8 items-center">
            <div className="flex flex-row" style={{height: '95%'}}>
              <div className="flex flex-wrap overflow-auto justify-center">
                {Array.isArray(shows) && shows.map((v,i)=>(
                  <ShowPreviewCard key={i} preview={v.movie?.preview} name={v.movie?.name} tags={v.movie?.tags} date={v?.begin_date} onClick={()=>{router.push(v["@id"]?.slice(4))}}/>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Link className="text-xs underline" href="/shows">Show more</Link>
              <MdKeyboardDoubleArrowDown size="12px" />
            </div>
        </div>
      </div>
    </>
  );
}
