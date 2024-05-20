"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { AiOutlineMenu, AiOutlineLogin, AiOutlineLogout, AiOutlineProfile, AiOutlinePicLeft, AiOutlineApartment, AiOutlineCode, AiOutlineUserAdd, AiOutlineStar } from "react-icons/ai";
import { signOut } from "next-auth/react";
import Link from "next/link";
import HostModal from "../inputs/hostmodal";
import { SafeUser } from "@/app/types/type";
import AuthModal from "../inputs/authmodal";

interface MenuProps {
  user?: SafeUser | null;
}

const Menu = ({ user }: MenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [hostModalOpen, sethostModalOpen] = useState(false);
  const [modalOption, setModalOption] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, [menuOpen]);

  const hostModal = useCallback(() => {
    sethostModalOpen((prev) => !prev);
    setMenuOpen(false);
  }, []);

  const openModal = useCallback((option: string) => {
    setModalOption(option);
    setModalOpen(true);
    setMenuOpen(false);
  }, []);

  const closeModal = useCallback(() => {
    setModalOption("");
    setModalOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className="relative"  ref={menuRef}>
      <div className="md:block cursor-pointer" onClick={toggleMenu}>
        <AiOutlineMenu />
      </div>
      {menuOpen && (
        <div className="menu-options absolute top-6 right-0 z-50 w-48 bg-white rounded-lg shadow-md">
          {user ? (
            <>
              <div key="profile" className="menu-item" onClick={() => toggleMenu()}>
                <AiOutlinePicLeft className="menu-icon" />
                <Link href="profile"> My Profile</Link>
              </div>
              <div key="reservations" className="menu-item" onClick={() => {toggleMenu();}}>
                <AiOutlineProfile className="menu-icon" />
                <Link href="/reservations">My reservations</Link>
              </div>
              <div key="favourites" className="menu-item" onClick={() => {toggleMenu();}}>
                <AiOutlineStar className="menu-icon" />
                <Link href="/favourites">My favourites</Link>
              </div>
              {user.role === "USER" && (
                <div key="host" className="menu-item" onClick={() => {hostModal()}}>
                  <AiOutlineApartment className="menu-icon" />
                  <span>Become a host</span>
                  <HostModal user={user.email} isOpen={hostModalOpen} onClose={()=>sethostModalOpen(false)}/>
                </div>
              )}
              {user.role === "HOST" && (
                <div key="hostboard" className="menu-item" onClick={()=>{toggleMenu();}}>
                  <AiOutlineCode className="menu-icon" />
                  <Link href="/hostboard">Hostboard</Link>
                </div>
              )}
              {user.role === "ADMIN" && (
                <div key="dashboard" className="menu-item" onClick={()=>toggleMenu()}>
                  <AiOutlineCode className="menu-icon" />
                  <Link href="/dashboard">Dashboard</Link>
                </div>
              )}
              <div key="logout" className="menu-item" onClick={() => signOut()}>
                <AiOutlineLogout className="menu-icon" />
                <span>Logout</span>
              </div>
            </>
          ) : (
            <>
              <div key="login" className="menu-item" onClick={() => openModal("login")}>
                <AiOutlineLogin className="menu-icon" />
                <span>Login</span>
              </div>
              <div key="signup" className="menu-item" onClick={() => openModal("signup")}>
                <AiOutlineUserAdd className="menu-icon" />
                <span>Signup</span>
              </div>
            </>
          )}
        </div>
      )}
      <AuthModal isOpen={modalOpen} onClose={closeModal} onOpen={openModal} content={modalOption}/>
      {user && ( <HostModal user={user.email} isOpen={hostModalOpen} onClose={()=>sethostModalOpen(false)}/>)}
    </div>
  );
};

export default Menu;
