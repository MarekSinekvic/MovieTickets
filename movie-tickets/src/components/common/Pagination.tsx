import Link from "next/link";
import { PagedCollection } from "../../types/collection";
import { useRouter } from "next/router";

interface Props {
  collection: PagedCollection<unknown>;
  getPagePath: (path: string) => string;
}

const framePages = (page: number,last?: number,max = 14) => {
  last = isNaN(last) ? 1 : last;
  if (last && last > max) {
    const frame1 = Math.min(page-max/2-1,1);
    const frame2 = Math.max(page+max/2-2,last)-last;
    
    return new Array(max).fill(0).map((_,i)=>((i + page - (max/2+frame1+frame2))));
  } else return new Array(last ?? 1).fill(0).map((_,i)=>i+1);
};
const Pagination = ({ collection, getPagePath }: Props) => {
  const view = collection && collection["view"];
  if (!view) return null;
  const router = useRouter();

  const {
    first: first,
    previous: previous,
    next: next,
    last: last,
  } = view;
  
  const currentPage = Number(router.query['page'] ?? 1);
  const lastPage = last ? Number(last.split('?')[1].split('=')[1]) : 1;
  return (
    <div className="flex justify-center gap-2 p-2">
      <div>
        <Link className="button" href={first ? getPagePath(first) : "#"}>First</Link>
        <Link className="button" href={previous ? getPagePath(previous) : "#"}>Previous</Link>
      </div>
      <div className="flex gap-1">
        {framePages(currentPage,lastPage).map(p=>(
          <Link href={getPagePath("?page="+p)} className={`${p==currentPage ? 'text-gray-400' : ''}`}>
            {p}
          </Link>
        ))}
      </div>
      <div>
        <Link className="button" href={next ? getPagePath(next) : "#"}>Next</Link>
        <Link className="button" href={last ? getPagePath(last) : "#"}>Last</Link>
      </div>
    </div>
  );
};

export default Pagination;
