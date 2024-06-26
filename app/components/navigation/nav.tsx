'use client';
import { SafeUser } from "@/app/types/type";
import Menu from "./menu";
import { useEffect } from "react";

interface NavProps{
  user?: SafeUser | null;
}

const Nav = ({user}: NavProps)=>{
  useEffect(()=>{
    user = user;
  },[user])
  
  return (
    <div className="w-full bg-purple-500 shadow-lg py-5">
        <div className="px-4">
            <div className="flex flex-row items-center justify-between">
                <div className="text-white font-semibold text-2xl"><a href="/">StayAway</a></div>
                <div className="flex flex-row items-center text-white space-x-4">
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <Menu user = {user}/>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Nav;
