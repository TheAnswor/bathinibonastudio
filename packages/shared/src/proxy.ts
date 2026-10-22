import {NextRequest,NextResponse} from 'next/server';
import {demoHome,demoTracks,demoArtists,demoReleases,demoEvents,genres,demoStats}from'./demo';
const API_BASE=(process.env.WORDPRESS_URL||'http://localhost:8080').replace(/\/$/,'')+'/wp-json/bbm/v1/';
function jsonError(message:string,status:number){return NextResponse.json({message},{status});}
async function handle(request:NextRequest){
 const path=request.nextUrl.searchParams.get('path')||'';
 if(!/^[a-zA-Z0-9_\-/]+$/.test(path)||path.includes('..')||path.startsWith('/'))return jsonError('Invalid API route',400);
 const method=request.method.toUpperCase();
 if(!['GET','POST','PATCH','DELETE'].includes(method))return jsonError('Method not allowed',405);
 if(method!=='GET'){
  const origin=request.headers.get('origin');
  if(origin){try{if(new URL(origin).host!==request.nextUrl.host)return jsonError('Cross-origin request rejected',403);}catch{return jsonError('Invalid origin',403)}}
  const fetchSite=request.headers.get('sec-fetch-site');if(fetchSite==='cross-site')return jsonError('Cross-site request blocked',403);
 }
 if(process.env.BBM_DEMO_MODE==='true' && method==='GET'){
  const data:Record<string,unknown>={home:demoHome,tracks:demoTracks,artists:demoArtists,releases:demoReleases,events:demoEvents,genres, 'admin/stats':demoStats,'studio/tracks':[], 'studio/events':[], 'studio/campaigns':[], 'studio/earnings':{balance:0,rows:[]},'admin/tracks':[],'admin/events':[],'admin/campaigns':[]};
  if(path in data)return NextResponse.json(data[path]);
 }
 const headers:Record<string,string>={Accept:'application/json'};
 const token=request.cookies.get('bbm_access')?.value;if(token)headers.Authorization=`Bearer ${token}`;
 const isForm=request.headers.get('content-type')?.includes('multipart/form-data');
 let body:BodyInit|undefined;
 if(method!=='GET'){
  if(isForm)body=await request.formData();
  else{body=await request.text();headers['Content-Type']='application/json';}
 }
 const url=new URL(API_BASE+path);if(method==='GET')request.nextUrl.searchParams.forEach((v,k)=>{if(k!=='path')url.searchParams.set(k,v)});
 let response:Response;
 try{response=await fetch(url,{method,headers,body,cache:'no-store',redirect:'error',signal:AbortSignal.timeout(15000)});}catch{return jsonError('WordPress API is unavailable. Install the included plugin and set WORDPRESS_URL, or enable BBM_DEMO_MODE for catalogue previews.',503)}
 let data:unknown;try{data=await response.json()}catch{data={message:'WordPress returned a non-JSON response'}};
 const out=NextResponse.json(data,{status:response.status});
 if(response.ok && (path==='auth/login'||path==='auth/register') && data && typeof data==='object' && 'token' in data){
   const d=data as {token:string,user:unknown};
   const domain=request.nextUrl.hostname.endsWith('.bathinibona.co.za')||request.nextUrl.hostname==='bathinibona.co.za'?'.bathinibona.co.za':undefined;
   const clean=NextResponse.json({user:d.user});
   clean.cookies.set('bbm_access',d.token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:60*60*12,domain});
   return clean;
 }
 if(path==='auth/logout')out.cookies.set('bbm_access','',{httpOnly:true,path:'/',maxAge:0,domain:request.nextUrl.hostname.endsWith('.bathinibona.co.za')||request.nextUrl.hostname==='bathinibona.co.za'?'.bathinibona.co.za':undefined});
 return out;
}
export const GET=handle;export const POST=handle;export const PATCH=handle;export const DELETE=handle;
