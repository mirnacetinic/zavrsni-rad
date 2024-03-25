'use client';

import Menu from "./menu";
import Searchbar from "./searchbar";

const Nav = () => {
  return (
    <div className="w-full bg-purple-500 shadow-lg py-5">
        <div className="px-4">
            <div className="flex flex-row items-center justify-between">
                <div className="text-white font-semibold text-2xl">StayAway</div>
                <div className="flex flex-row items-center text-white text uppercase space-x-4">
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <Menu/>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Nav;
