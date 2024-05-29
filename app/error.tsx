"use client";

import Link from "next/link";


export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl">Something went wrong!</h2>
      <p>{error.message}</p>
      <div>
      <button  className="form_button" onClick={() => reset()}>Try again</button>
      or 
      <button className="form_button"><Link href="/">Go Home</Link></button>
      </div>
      
    </div>
  );
}
