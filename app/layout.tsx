import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "WESTERN — Built for the City",
  description: "Premium Egyptian streetwear. Designed in Cairo, made to move.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "WESTERN — Built for the City",
    description: "Premium Egyptian streetwear. Designed in Cairo, made to move.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "WESTERN — Built for the City" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WESTERN — Built for the City",
    description: "Premium Egyptian streetwear. Designed in Cairo, made to move.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','960768263713631');fbq('track','PageView');`}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=960768263713631&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}
