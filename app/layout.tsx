import type { Metadata } from "next";
import { Inconsolata } from "next/font/google";
import "./globals.css";
import Nav from "./components/navigation/nav";
import { Toaster } from "react-hot-toast";
import getUser from "./actions/getUser";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
 
import { ourFileRouter } from "@/app/api/uploadthing/core";


export const metadata: Metadata = {
  title: "StayAway",
  description: "Book your dream vacation rental",
};

const font= Inconsolata({
  subsets: ["latin"]
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  return (
    <html lang="en">
      <body className={font.className}>
        <Nav user= {user}/>
        <Toaster/>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)}/>
        {children}
      </body>
    </html>
  );
}
