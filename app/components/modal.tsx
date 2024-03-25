'use client';
import React from "react";
import { AiOutlineClose } from "react-icons/ai";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

function Modal({ isOpen, onClose, content}: ModalProps) {
  const showContent = () => {
    switch (content) {
      case "login":
        return (
          <>
            <h3 className="text-2xl font-bold text-gray-900">Login</h3>
            <div className="mt-2 px-7 py-3">
              <p className="text-lg text-gray-500">Login form goes here...</p>
            </div>
          </>
        );
      case "signup":
        return (
          <>
            <h3 className="text-2xl font-bold text-gray-900">Sign Up</h3>
            <div className="mt-2 px-7 py-3">
              <p className="text-lg text-gray-500">Sign up form goes here...</p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-70 z-50 animate-fadeIn"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 animate-slideInDown">
            <div className="p-8 border w-96 shadow-lg rounded-md bg-white relative">
              <div className="absolute text-black top-2 right-2 cursor-pointer" onClick={onClose}>
                <AiOutlineClose/>
              </div>
              <div className="text-center">
                {showContent()}
                <div className="flex justify-center mt-4">
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Modal;
