import { ENTRYPOINT } from "@/config/entrypoint";
import { Media } from "@/types/Media";
import { useEffect, useState } from "react";
// import { fetch } from "@/utils/dataAccess";


export default function ({iri} : {iri: string|undefined}) {
    const [image,setImage] = useState<string|null>();
    
    useEffect(()=>{
        console.log(iri);
        if (!iri) return;
        (async ()=>{
            // const res = await fetch<Media>(iri, {
            //     method: 'get'
            // });
            // if (res?.data)
            //     setImage(res.data.file);

            const pathNodes = iri.split('/');
            if (pathNodes[1] == 'api') iri = iri.slice(4);
            const res = await fetch(ENTRYPOINT+iri, {method:'get'});
            if (res.status == 200)
                setImage((await res.json()).file);
        })();
    },[]);
    return (
        <div>
            {image ? (<div>
                <img src={image} height={'auto'} style={{objectFit:'contain', height: '300px'}} className="rounded-md"/>
            </div>) : (
                <div style={{height: '300px', border: '1px solid dashed'}}>Loading...</div>
            )}
        </div>
    );
}