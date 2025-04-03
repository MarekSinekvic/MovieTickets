'use client'
import "@/app/globals.css";
import { ENTRYPOINT } from "@/config/entrypoint";
import { Formik } from "formik";
import { useRouter } from "next/router";



export default function Login() {
    const router = useRouter();
    return (
        <>
            <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center">
                <div className="h-full" style={{background: 'radial-gradient(white 0%, black 80%)', width: '1px'}}></div>
                <div className="px-8 flex flex-col justify-center items-center gap-1">
                    {/* <input placeholder="Username"/>
                    <input placeholder="Password"/>
                    <input type="button"/> */}
                    <div style={{fontSize: "26px"}}>Login</div>
                    <Formik initialValues={{username:"",password:""}} onSubmit={(values, {setErrors})=>{
                        (async ()=>{
                            const res = await fetch(ENTRYPOINT+"/auth", {method:"post", credentials: 'include', body: JSON.stringify(values), headers: {"Content-Type": "application/json"}});
                            if (res.status == 200) router.push('/');
                            else setErrors({username:"Invalid",password:"Invalid"});
                        })();
                    }}>
                        {({ values, errors,
                            handleChange,
                            handleSubmit
                        })=>(
                            <form onSubmit={handleSubmit} className="flex flex-col gap-1" method="post">
                                <input placeholder="Username" name="username" onChange={handleChange}/>
                                <input placeholder="Password" name="password" type="password" onChange={handleChange}/>
                                <input type="submit" value={"Login"} className="w-full"/>
                                <div>
                                    <a className="text-xs" href="/auth/register">Register</a>
                                </div>
                                {errors.username == "Invalid" ? (
                                    <span style={{color:'red', textAlign: 'center'}}>Invalid credentials</span>
                                ) : ""}
                            </form>
                        )}
                    </Formik>
                </div>
                <div className="h-full" style={{background: 'radial-gradient(white 0%, black 80%)', width: '1px'}}></div>
            </div>
        </>
    );
}