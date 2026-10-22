import type {Metadata} from 'next';
import './globals.css';
import {AuthProvider} from '@bbm/shared/src/auth';
export const metadata:Metadata={title:'Bathini Bona Studio', description:'Discover the sound of Bathini Bona.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en-ZA"><body><AuthProvider><>{children}</></AuthProvider></body></html>}
