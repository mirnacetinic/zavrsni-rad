'use client';
import { useState, useCallback } from "react";
import { AiOutlineMenu, AiOutlineLogin, AiOutlineUserAdd, AiOutlineLogout, AiOutlineProfile, AiOutlinePicLeft, AiOutlineApartment, AiOutlineCode } from "react-icons/ai";
import Modal from "../inputs/modal";
import { User } from "@prisma/client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import HostModal from "../inputs/hostmodal";

interface MenuProps {
    user?: User | null;
}

const Menu = ({ user }: MenuProps) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [hostModalOpen, sethostModalOpen] = useState(false);
    const [modalOption, setModalOption] = useState("");

    const toggleMenu = useCallback(() => {
        setMenuOpen(prev => !prev);
    }, []);

    const hostModal = useCallback(() => {
        sethostModalOpen(prev => !prev);
    }, []);

    const openModal = useCallback((option: string) => {
        setModalOption(option);
        setModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalOption("");
        setModalOpen(false);
    }, []);

    return (
        <div className="relative">
            <div className="md:block cursor-pointer" onClick={toggleMenu}>
                <AiOutlineMenu />
            </div>
            {menuOpen && (
                <div className="menu-options absolute top-6 right-0 z-50 w-48 bg-white rounded-lg shadow-md">
                    {user ? (
                        <>
                            <div key="profile" className="menu-item" onClick={() => {}}>
                                <AiOutlinePicLeft className="menu-icon" />
                                <span> My Profile</span>
                            </div>
                            <div key="reservations" className="menu-item" onClick={() => {}}>
                                <AiOutlineProfile className="menu-icon" />
                                <span>My reservations</span>
                            </div>
                            {user.role === "USER" && (
                            <div key="host" className="menu-item" onClick={() => {hostModal()}}>
                                <AiOutlineApartment className="menu-icon" />
                                <span>Become a host</span>
                            </div>)}
                            {user.role === "HOST" && (
                                <div key="hostboard" className="menu-item">
                                    <AiOutlineCode className="menu-icon" />
                                    <Link href="/hostboard">Hostboard</Link>
                                </div>
                            )}
                            {user.role === "ADMIN" && (
                                <div key="dashboard" className="menu-item">
                                    <AiOutlineCode className="menu-icon" />
                                    <Link href="/dashboard">Dashboard</Link>
                                </div>
                            )}
                            <div key="logout" className="menu-item" onClick={() => signOut()}>
                                <AiOutlineLogout className="menu-icon" />
                                <span>Logout</span>
                            </div>
                            <HostModal user={user.email} isOpen={hostModalOpen} onClose={hostModal} />
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
            <Modal isOpen={modalOpen} onClose={closeModal} onOpen={openModal} content={modalOption} />
        </div>
    );
};

export default Menu;
