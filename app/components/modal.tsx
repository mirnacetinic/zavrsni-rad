'use client';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, FieldValues} from "react-hook-form";
import { AiOutlineClose } from "react-icons/ai";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: (modalContent: string) => void;
  content: string;
}

const Modal = ({ isOpen, onClose, onOpen, content }: ModalProps) => {
  const{
    register,
    handleSubmit,
    formState: {errors},
    reset,

  } = useForm();
  const router = useRouter();

  const handleLogin = async (data: FieldValues) => {
    const login = await signIn('credentials',{email : data.email, password: data.password, callbackUrl: '/confirm'});
    if(login?.error){
      reset();
      console.log(login.error);
    }
  };

  const handleRegister = async (data:FieldValues) => {
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log("Registration success");
        onOpen("login");
        router.refresh();
      } else {
        reset();
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
                      <input {...register("name", {
                        required:"Name is required",
                        minLength:{
                          value:2,
                          message:"Name must be at least 2 characters",
                        }})} 
                        type="text" name="name" placeholder="Name" 
                        className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-purple-300"/>
                          {errors.name && (
                            <p className="text-red-500">{`${errors.name.message}`}</p>
                          )}

                      <input {...register("surname",
                        {required:"Surname is required"})} type="text" name="surname" placeholder="Surname"
                        className="mt-4 block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-gray-300"/>  
                          {errors.surname && (
                          <p className="text-red-500">{`${errors.surname.message}`}</p>
                        )}
                    </>
                  )}
                  <input {...register("email",
                    {required:"Email is required",
                      pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[a-z]+$/i,
                      message: 'Invalid email format',
                    },})} type="email" name="email" placeholder="Email" 
                    className="mt-4 block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-purple-300"/>
                      {errors.email && (
                          <p className="text-red-500">{`${errors.email.message}`}</p>
                        )}

                  <input {...register("password",
                    {required:"Password is required"})} type="password" name="password" placeholder="Password"
                    className="mt-4 block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-gray-300"/>
                      {errors.password && (
                          <p className="text-red-500">{`${errors.password.message}`}</p>
                        )}

                  {content === "login" ? 
                    <button onClick={handleSubmit(handleLogin)}
                      className="mt-6 w-full px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-600">
                      Login </button> 
                  : 
                    <button onClick={handleSubmit(handleRegister)}
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