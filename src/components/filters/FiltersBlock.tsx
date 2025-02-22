import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import SearchInput from "../SearchInput";
import DatesSelector from "./DatesSelector";
import SortSelector from "./SortSelector";
import TagsSelector from "./TagsSelector";
import { useRouter } from "next/router";
import { filterQueryBuilder } from "@/utils/dataAccess";

export default function ({filtersSetter = undefined} : {filtersSetter?: Dispatch<SetStateAction<string>>}) {
    const {push: route, query: {sort, name, 'tags[]': tags, date}} = useRouter();

    const sortQuery = useRef(sort);
    const tagsQuery = useRef(tags ?? []);
    const searchQuery = useRef(name);
    const dateQuery = useRef(date);    
    const applyFilters = () => {
        
        route(`?${filterQueryBuilder({sort: sortQuery.current, name: searchQuery.current, tags: tagsQuery.current, date: dateQuery.current})}`);
    }
    return (
        <>
            <div className="p-6 flex justify-evenly w-full">
                <div className="flex gap-4 items-center">
                    <div><DatesSelector defaultValue={name} ref={dateQuery} onApply={()=>{applyFilters()}}/></div>
                    <div>
                        <TagsSelector defaultValue={tags} ref={tagsQuery} onApply={()=>{applyFilters()}}/>
                    </div>
                    <div className="flex items-center">
                        <SearchInput defaultValue={name} ref={searchQuery} onApply={()=>{applyFilters()}}/>
                    </div>
                </div>
                <div className="flex items-center gap-2 relative">
                    <SortSelector defaultValue={sort} ref={sortQuery} items={['id','name','end_date']} onApply={()=>{applyFilters()}}/>
                </div>
            </div>
        </>
    );
}