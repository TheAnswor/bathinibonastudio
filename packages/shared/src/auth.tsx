'use client';
import React,{createContext,useContext,useEffect,useState} from 'react';
import {api,getMe} from './api';
import type{User}from'./types';
type Auth={user:User|null;loading:boolean;reload:()=>Promise<void>;login:(email:string,password:string)=>Promise<User>;register:(name:string,email:string,password:string,kind:'fan'|'studio')=>Promise<User>;logout:()=>Promise<void>};
const C=createContext<Auth|null>(null);
export function AuthProvider({children}:{children:React.ReactNode}){
 const[user,setUser]=useState<User|null>(null);const[loading,setLoading]=useState(true);
 async function reload(){setUser(await getMe());setLoading(false);}
 useEffect(()=>{void reload();},[]);
 async function login(email:string,password:string){const out=await api<{user:User}>('auth/login',{method:'POST',body:JSON.stringify({email,password})});setUser(out.user);return out.user;}
 async function register(name:string,email:string,password:string,kind:'fan'|'studio'){const out=await api<{user:User}>('auth/register',{method:'POST',body:JSON.stringify({name,email,password,kind})});setUser(out.user);return out.user;}
 async function logout(){try{await api('auth/logout',{method:'POST'});}finally{setUser(null);}}
 return <C.Provider value={{user,loading,reload,login,register,logout}}>{children}</C.Provider>;
}
export function useAuth(){const ctx=useContext(C);if(!ctx)throw new Error('AuthProvider is missing');return ctx;}
