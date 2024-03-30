'use client';
import { useState, useCallback } from "react";
import { AiOutlineMenu, AiOutlineLogin, AiOutlineUserAdd } from "react-icons/ai";
import Modal from './modal';

const Menu = () => {
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
            {menuOpen && 
            (
                <div className={`fixed ${menuOpen ? "block" : "hidden"} top-12 right-2 w-40 rounded shadow-md bg-white text-semibold text-black`}>
                    <div onClick={() => openModal("login")} className="flex items-center justify-center px-2 py-2 cursor-pointer rounded hover:bg-gray-300">
                        <AiOutlineLogin className="mr-2" />
                        <span>Login</span>
                    </div>
                    <div onClick={() => openModal("signup")} className="flex items-center justify-center px-2 py-2 cursor-pointer rounded hover:bg-gray-300">
                        <AiOutlineUserAdd className="mr-2" />
                        <span>Signup</span>
                    </div>
                </div>
            )}
            <Modal isOpen={modalOpen} onClose={closeModal} onOpen={openModal} content={modalOption} /> 
        </div>
    );
}

export default Menu;
