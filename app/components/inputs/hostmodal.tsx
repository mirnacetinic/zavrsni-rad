'use client';
import { useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";
import { useRouter } from "next/navigation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: string;
}

enum Steps {
  AGREEMENT,
  TYPE,
  INFO,
  AMENITY,
  IMAGES,
  FINISH,
}

const HostModal = ({ isOpen, onClose, user }: ModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const [step, setStep] = useState(Steps.AGREEMENT);

  const back = () => {
    if (step > Steps.AGREEMENT) {
      setStep((value) => value - 1);
    }
  };

  const next = () => {
    if (step < Steps.FINISH) {
      setStep((value) => value + 1);
  }};

  const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "No") {
      onClose();
    }
  };

  const createAccommodation = async (data: FieldValues) => {
    data.user = user;
  
    const response = await fetch("/api/accomodation", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (response.ok) {
      toast.success("Success");
      const data = await response.json();
      onClose();
      router.replace(`accomodations/${data.id}`);
    } else {
      toast.error(response.headers.get("message"));
    }
  }

  return (
    <div>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-70 z-50 animate-fadeIn"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 animate-slideInDown">
            <div className="p-8 border w-96 shadow-lg rounded-md bg-white relative">
              <div className="absolute text-black top-2 right-2 cursor-pointer"
                onClick={onClose}>
                <AiOutlineClose />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">
                  {Steps[step]}
                </h3>
              </div>
              {step === Steps.AGREEMENT && (
                <div className="text-black">
                  <p>Do you agree to hosting your property on StayAway?</p>
                  <input
                    type="radio"
                    id="agree"
                    value="Yes"/>
                  <label htmlFor="agree">Yes</label>
                  <input
                    type="radio"
                    id="disagree"
                    value="No"
                    onChange={handleAgreementChange}/>
                  <label htmlFor="disagree">No</label>
                </div>
              )}
              {step === Steps.TYPE && (
                <div className="text-black">
                  <p>What kind of property?</p>
                  <select id="type" {...register("type")}>
                    <option value="House">House</option>
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Room">Room</option>
                  </select>
                </div>
              )}
              {step === Steps.AMENITY && (
                <div className="text-black">
                <p>What amenities does your property have?</p>
                <label htmlFor="petFriendly">
                  <input
                    id="petFriendly"
                    type="checkbox"
                    {...register("amenities")}
                    value="Pet friendly"/>
                  Pet friendly
                </label>
                <br />
                <label htmlFor="pool">
                  <input
                    id="pool"
                    type="checkbox"
                    {...register("amenities")}
                    value="Pool"
                  />
                  Pool
                </label>
                <br />
                <label htmlFor="stove">
                  <input
                    id="stove"
                    type="checkbox"
                    {...register("amenities")}
                    value="Stove"
                  />
                  Stove
                </label>
                <br />
                <label htmlFor="ac">
                  <input id="ac" type="checkbox" {...register("amenities")} value="AC" />
                  AC
                </label>
              </div>
              
              )}
              {step === Steps.INFO && (
                <div className="text-black mt-6">
                  <input
                    {...register("title", {
                      required: "Title is required",
                      minLength: {
                        value: 2,
                        message: "Title must be at least 2 characters",
                      }, })}
                    type="text"
                    name="title"
                    placeholder="Title"
                    className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-purple-300"/>
                  {errors.title && (
                    <p className="text-red-500">{`${errors.title.message}`}</p>
                  )}
                  <input
                    {...register("description", {
                      required: "Description is required",
                      minLength: {
                        value: 2,
                        message:
                          "Description must be at least 2 characters",
                      },})}
                    type="text"
                    name="description"
                    placeholder="Description"
                    className="mt-4 block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-gray-300"/>
                  {errors.description && (
                    <p className="text-red-500">{`${errors.description.message}`}</p>)}
                  <input
                    {...register("location", {
                      required: "Location is required",
                    })}
                    type="text"
                    name="location"
                    placeholder="Location"
                    className="mt-4 block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-gray-300"/>
                  {errors.location && (
                    <p className="text-red-500">{`${errors.location.message}`}</p>)}
                </div>
              )}
              <button
                onClick={back}
                className={`mx-8 mt-4 px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-600 
                ${step === Steps.AGREEMENT ? "hidden" : ""}`}>
                Back
              </button>
              <button
                onClick={next}
                className={`mx-4 mt-4 px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-600 
                ${step === Steps.FINISH ? "hidden" : ""}`}>
                Next
              </button>
              {step === Steps.FINISH && (
                <button
                  onClick={handleSubmit(createAccommodation)}
                  className="mx-4 mt-4 px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-600">
                  Create
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HostModal;
