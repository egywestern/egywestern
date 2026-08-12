import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"CAIRO 26 — Built for the City",description:"Premium Egyptian streetwear. Designed in Cairo, made to move.",icons:{icon:"/favicon.svg"},openGraph:{title:"CAIRO 26 — Built for the City",description:"Premium Egyptian streetwear. Designed in Cairo, made to move.",images:[{url:"/og.png",width:1200,height:630,alt:"CAIRO 26 — Built for the City"}]},twitter:{card:"summary_large_image",title:"CAIRO 26 — Built for the City",description:"Premium Egyptian streetwear. Designed in Cairo, made to move.",images:["/og.png"]}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
