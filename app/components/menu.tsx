'use client';
import { useCallback, useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineLogin, AiOutlineUserAdd  } from "react-icons/ai";
import Modal from './modal';

const Menu = () => {
    const [menuOpen, menuState] = useState(false);
    const [modalOpen, modalState] = useState(false);
    const [modalOption, selectedOption] = useState("");

    const toggleMenu = useCallback(() => {
        menuState(now => !now);
    }, []);

    const openModal = useCallback((modalOption:string)=>{
        modalState(now =>!now);
        selectedOption(modalOption);
    },[]);

    useEffect(() => {
        if (modalOpen) {
            menuState(false);
        }
    }, [modalOpen]);

    return (
        <div>
            <div className="md:block cursor-pointer" onClick={toggleMenu}>
                <AiOutlineMenu/>
            </div>
            {menuOpen && 
            (
                <div className={'fixed flex flex-col top-12 right-2 w-40 rounded shadow-md bg-white text-semibold text-black animate-menu'}>
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
            <Modal isOpen={modalOpen} onClose={()=>openModal("")} content= {modalOption} /> 
        </div>
    );
}

export default Menu;