import type { Home, User } from './types';
import {demoHome} from './demo';
export const demoMode = process.env.NEXT_PUBLIC_BBM_DEMO === 'true';
export async function api<T>(path:string, options:RequestInit={}):Promise<T> {
 const opts:RequestInit={...options, credentials:'same-origin',cache:'no-store'};
 if(options.body && !(options.body instanceof FormData)) opts.headers={ 'Content-Type':'application/json',...options.headers };
 const res=await fetch(`/api/bridge?path=${encodeURIComponent(path)}`,opts);
 const data=await res.json().catch(()=>({message:'Unexpected server response'}));
 if(!res.ok) throw new Error(data.message || data.error || `Request failed (${res.status})`);
 return data as T;
}
export async function loadHome():Promise<Home> {try { return await api<Home>('home'); }catch{ return demoMode?demoHome:{trending:[],tracks:[],artists:[],releases:[],events:[],genres:[],recommended:[]}; }}
export async function getMe():Promise<User|null>{try{return await api<User>('auth/me');}catch{return null;}}
export function money(amount:number){return `R${amount.toLocaleString('en-ZA',{minimumFractionDigits:2,maximumFractionDigits:2})}`;}
export function niceDate(iso:string){try{return new Date(iso).toLocaleDateString('en-ZA',{month:'short',day:'numeric',year:'numeric'});}catch{return iso;}}
