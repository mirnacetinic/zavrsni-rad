'use client';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: (modalContent: string) => void;
  content: string;
}

const Modal = ({ isOpen, onClose, onOpen, content }: ModalProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: ""
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleLogin = async () => {
    const login = await signIn('credentials',{ email : formData.email, password: formData.password, callbackUrl: '/confirm'});
    if(login?.error){
      console.log(login.error);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          password: formData.password
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log("Registration success");
        onOpen("login");
        router.refresh();
      } else {
        console.log("Registration failed");
      }
    } catch (error) {
      console.error('Error registering:', error);
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
                <AiOutlineClose />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">{content === "login" ? "Login" : "Sign Up"}</h3>
                <div className="text-black mt-6">
                  {content =="signup" &&(
                    <>
                      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange}
                        className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-purple-300"/>

                      <input type="text" name="surname" placeholder="Surname" value={formData.surname} onChange={handleInputChange}
                        className="mt-4 block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-gray-300"/>  
                    </>
                  )}
                  <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange}
                    className="mt-4 block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-purple-300"/>

                  <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange}
                    className="mt-4 block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-gray-300"/>

                  {content === "login" ? 
                    <button onClick={handleLogin}
                      className="mt-6 w-full px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-600">
                      Login </button> 
                  : 
                    <button onClick={handleRegister}
                    className="mt-6 w-full px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-600">
                    Sign up </button> 
                  }   
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Modal;
