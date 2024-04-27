'use client';
import { User } from "@prisma/client";
import Menu from "./menu";

interface NavProps{
  user?: User | null;
}

const Nav: React.FC<NavProps> = ({user})=>{
  return (
    <div className="w-full bg-purple-500 shadow-lg py-5">
        <div className="px-4">
            <div className="flex flex-row items-center justify-between">
                <div className="text-white font-semibold text-2xl">StayAway</div>
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
