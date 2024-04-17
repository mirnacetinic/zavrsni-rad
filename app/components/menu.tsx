'use client';
import { useState, useCallback } from "react";
import { AiOutlineMenu, AiOutlineLogin, AiOutlineUserAdd, AiOutlineLogout, AiOutlineProfile, AiOutlinePicLeft, AiOutlineApartment, AiOutlineCode } from "react-icons/ai";
import Modal from './modal';
import { User } from "@prisma/client";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface MenuProps{
    user?: User | null;
}

const Menu: React.FC<MenuProps> = ({user})=>{
    const [menuOpen, setMenuOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOption, setModalOption] = useState("");

    const toggleMenu = useCallback(() => {
        setMenuOpen(prev => !prev);
    }, []);

    const openModal = useCallback((option:string) => {
        setModalOption(option);
        setModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalOption("");
        setModalOpen(false);
    }, []);

    return (
        <div>
            <div className="md:block cursor-pointer" onClick={toggleMenu}>
                <AiOutlineMenu/>
            </div>
            {menuOpen && (
        <div className="menu-options">
          {user ? (
            <>
              <div onClick={() => {}} className="menu-item">
                <AiOutlinePicLeft className="menu-icon" />
                <span> My Profile</span>
              </div>
              <div onClick={() => {}} className="menu-item">
                <AiOutlineProfile className="menu-icon" />
                <span>My reservations</span>
              </div>
              <div onClick={() => {}} className="menu-item">
                <AiOutlineApartment className="menu-icon" />
                <span>Become a host</span>
              </div>
              <div className="menu-item">
                <AiOutlineCode className="menu-icon" />
                <Link href="/dashboard">Dahboard</Link>
              </div>
              <div onClick={() => signOut()} className="menu-item">
                <AiOutlineLogout className="menu-icon" />
                <span>Logout</span>
              </div>
            </>
          ) : (
            <>
              <div onClick={() => openModal("login")} className="menu-item">
                <AiOutlineLogin className="menu-icon" />
                <span>Login</span>
              </div>
              <div onClick={() => openModal("signup")} className="menu-item">
                <AiOutlineUserAdd className="menu-icon" />
                <span>Signup</span>
              </div>
            </>
          )}
        </div>
      )}
      <Modal isOpen={modalOpen} onClose={closeModal} onOpen={openModal} content={modalOption} />
    </div>
  );
};

export default Menu;
