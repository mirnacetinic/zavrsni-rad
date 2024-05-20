import { ReactNode } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const ModalBase = ({ isOpen, onClose, children }: ModalBaseProps) => {
  if (!isOpen) return null;

  return (
    <>
    <div className="fixed inset-0 bg-gray-600 bg-opacity-70 z-50 animate-fadeIn"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 animate-slideInDown">
            <div className="p-8 border w-96 shadow-lg rounded-md bg-white relative">
        <button
          className="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-800 focus:outline-none"
          onClick={onClose}>
          <AiOutlineClose size={24} />
        </button>
        {children}
      </div>
    </div>
    </>
  );
};

export default ModalBase;
