import type { Metadata } from "next";
import { Inconsolata } from "next/font/google";
import "./globals.css";
import Nav from "./components/nav";
import Searchbar from "./components/searchbar";

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
        {children}
      </body>
    </html>
  );
}
