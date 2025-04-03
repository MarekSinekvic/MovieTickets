'use client'
import "@/app/globals.css";
import { ENTRYPOINT } from "@/config/entrypoint";
import { Formik } from "formik";
import { useRouter } from "next/router";


export default function () {
    const router = useRouter();
    return (
        <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center">
            <div className="h-full" style={{background: 'radial-gradient(white 0%, black 80%)', width: '1px'}}></div>
            <Formik 
                initialValues={{uuid: "", password: "", email: ""}}
                onSubmit={(values, {setErrors})=>{
                    (async ()=>{
                        const res = await fetch(ENTRYPOINT+"/users", {method:"post", headers: {"content-type": "application/ld+json"}, credentials: 'include', body: JSON.stringify(values)});
                        if (res.status == 201) router.push('/auth/login');
                        else setErrors({uuid:"Invalid"});
                    })();
                }}    
            >
                {({values, errors, handleChange, handleSubmit})=>
                    <form onSubmit={handleSubmit} method="post" className="flex flex-col items-center w-64 gap-1">
                        <span className="text-xl">Register</span>
                        <input placeholder="Email" name="email" defaultValue={values.email} onChange={handleChange}/>
                        <input placeholder="Username" name="uuid"defaultValue={values.uuid} onChange={handleChange}/>
                        <input placeholder="Password" name="password" defaultValue={values.password} onChange={handleChange}/>

                        <input type="submit" value="Register" />
                        {errors.uuid == "Invalid" ? (
                            <span style={{color:'red', textAlign: 'center'}}>Invalid credentials</span>
                        ) : ""}
                    </form>
                }
            </Formik>
            <div className="h-full" style={{background: 'radial-gradient(white 0%, black 80%)', width: '1px'}}></div>
        </div>
    );
}