'use client'
import { useEffect, useState } from "react";
import { BiSolidCircle } from "react-icons/bi";




export default function ({isLoading} : {isLoading:boolean}) {
    const [offset1, setOffset1] = useState<number>(0);
    const [offset2, setOffset2] = useState<number>(0);

    useEffect(()=>{
        if (!isLoading) return;
        const DT = 1000/60;
        let frame = 0;
        const I = setInterval(()=>{
            const o = Math.cos(frame/DT*2);
            let o1 = o; let o2 = o;
            if (o1 > 0) o1 = 0; if (o2 < 0) o2 = 0;
            setOffset1(o1); setOffset2(o2);
            frame++;
            
        },DT);
        // console.log(frame);
        return ()=>clearInterval(I);
    },[]);

    return (
        <>
            {isLoading ? (
                <div className="fixed left-0 top-0 w-screen h-screen flex justify-center items-center" style={{backgroundColor: 'black', zIndex: 1000}}>
                    <BiSolidCircle color="white" style={{left: (offset1*30)+'px', position:'relative'}}/>
                    <BiSolidCircle color="white" />
                    <BiSolidCircle color="white" style={{left: (offset2*30)+'px', position:'relative'}}/>
                </div>
            ) : ''}
        </>
    );
}