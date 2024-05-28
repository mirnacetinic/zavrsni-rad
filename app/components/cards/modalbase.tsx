import { ReactNode, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: string;
  height?: string;
}

const ModalBase = ({ isOpen, onClose, children, width, height }: ModalBaseProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-70 animate-fadeIn" onClick={onClose}></div>
      <div className="fixed inset-0 flex items-center justify-center mt-4 mb-4 animate-slideInDown">
        <div
          className={`p-8 border shadow-lg rounded-md bg-white relative overflow-auto ${
            width ? '' : 'min-w-96'
          } ${height ? '' : 'max-h-full'}`}
          style={{ width: width || 'auto', height: height || 'auto' }}
        >
          <button
            className="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={onClose}>
            <AiOutlineClose size={24} />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalBase;
