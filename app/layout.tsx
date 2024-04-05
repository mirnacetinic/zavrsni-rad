import type { Metadata } from "next";
import { Inconsolata } from "next/font/google";
import "./globals.css";
import Nav from "./components/nav";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "StayAway",
  description: "Book your dream vacation rental",
};

const font= Inconsolata({
  subsets: ["latin"]
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Nav/>
        <Toaster/>
        {children}
      </body>
    </html>
  );
}
