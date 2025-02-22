import { useRouter } from "next/router";
import { Dispatch, MutableRefObject, SetStateAction, useRef } from "react";


export default function ({width = 300, onApply = undefined, defaultValue = "", ref = undefined} : {width?:number, onApply?: Dispatch<SetStateAction<string|string[]>>, defaultValue?: string|string[], ref?: MutableRefObject<string|string[]|undefined>}) {
    const input = useRef<HTMLInputElement>(null);
    const router = useRouter();

    return (
        <div className="flex gap-1">
            <input placeholder="Search" defaultValue={defaultValue} style={{backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '4px', width: width+'px'}} ref={input}/>
            <button type="button" onClick={(e)=>{                
                const query = "name="+input.current?.value;

                if (ref)
                    ref.current = input.current?.value;

                if (onApply) onApply(input.current?.value);
                else router.push("?"+query);
            }}>Search</button>
        </div>
    );
}