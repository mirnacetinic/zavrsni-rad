"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, FieldValues } from "react-hook-form";
import toast from "react-hot-toast";
import ModalBase from "../cards/modalbase";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: (modalContent: string) => void;
  content: string;
}

const AuthModal = ({ isOpen, onClose, onOpen, content }: ModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  const handleLogin = async (data: FieldValues) => {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    }).then((login) => {
      if (login?.ok) {
        onClose();
        router.refresh();
        toast.success("Logged in");
      }
      if (login?.error) {
        toast.error(login.error);
      }
    });
  };

  const handleRegister = async (data: FieldValues) => {
    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      toast.success("Registration success");
      onOpen("login");
      router.refresh();
    } else {
      toast.error(response.headers.get("message") || "Registration failed");
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900">
          {content === "login" ? "Login" : "Sign Up"}
        </h3>
        <div className="text-black mt-6">
          {content === "signup" && (
            <>
              <input
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                type="text"
                name="name"
                placeholder="Name"
                className="form-input"
              />
              <p className="error">{errors?.name?.message}</p>

              <input
                {...register("surname", {
                  required: "Surname is required",
                  minLength: {
                    value: 2,
                    message: "Surname must be at least 2 characters",
                  },
                })}
                type="text"
                name="surname"
                placeholder="Surname"
                className="form-input"
              />
              <p className="error">{errors?.surname?.message}</p>
            </>
          )}

          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[a-z]+$/i,
                message: "Invalid email format",
              },
            })}
            type="email"
            name="email"
            placeholder="Email"
            className="form-input"
          />
          <p className="error">{errors?.email?.message}</p>

          <input
            {...register("password", {
              required: "Password is required",
            })}
            type="password"
            name="password"
            placeholder="Password"
            className="form-input"
          />
          <p className="error">{errors?.password?.message}</p>

          {content === "login" ? (
            <>
              <button
                onClick={handleSubmit(handleLogin)}
                className="mt-4 px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
              >
                Login
              </button>
              <p className="mt-1 text-gray-600">
                Don't have an account?{" "}
                <span
                  className="text-purple-800 cursor-pointer"
                  onClick={() => onOpen("signup")}
                >
                  Sign up
                </span>
              </p>
            </>
          ) : (
            <>
              <button
                onClick={handleSubmit(handleRegister)}
                className="mt-4 px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
              >
                Sign up
              </button>
              <p className="mt-1 text-gray-600">
                Already have an account?{" "}
                <span
                  className="text-purple-800 cursor-pointer"
                  onClick={() => onOpen("login")}
                >
                  Log in
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </ModalBase>
  );
};

export default AuthModal;
