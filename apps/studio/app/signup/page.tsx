'use client';
import {AuthForm,Header} from '@bbm/shared/src/components';
export default function Page(){return <><Header mode='studio'/><div className='auth-layout'><AuthForm kind='studio' register={true}/></div></>}
