import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";

interface ModalProps {
  isOpen: boolean;
  onClose : () => void;
  checkIn : string;
  checkOut : string;
  guests : string;
  email : string;
  unitId : Number;
}

enum Steps {
  RESERVE,
  INFO,
  PAYMENT,
  FINISH,
}

const ReservationModal = ({ isOpen, onClose, checkIn, checkOut, guests, email, unitId }: ModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    reset
  } = useForm({
    defaultValues: {
      checkIn: checkIn,
      checkOut: checkOut,
      guests: guests,
    }});

  const router = useRouter();
  const [step, setStep] = useState(Steps.RESERVE);
  useEffect(() => {
    setValue("checkIn", checkIn);
    setValue("checkOut", checkOut);
    setValue("guests", guests);
  }, [checkIn, checkOut, guests, setValue]);

  const back = () => {
    if (step > Steps.RESERVE) {
      setStep((value) => value - 1);
    }
  };

  const next = async () => {
    const isValid = await trigger();
    if (isValid && step < Steps.FINISH) {
      setStep((value) => value + 1);
    }
  };

  const handleSubmitReservation = async (data: FieldValues) => {
    data.email = email;
    data.unitId = unitId;
    const response = await fetch("/api/reservation", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        toast.success("Reservation success");
        const responseData = await response.json();
        reset();
        onClose();
      } else {
        toast.error(response.headers.get('message'));
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
                <h3 className="text-2xl font-bold text-gray-900">{Steps[step]}</h3>
              </div>
              {step === Steps.RESERVE && (
                <div className="text-black">
                  <p>Is this information is correct?</p>
                  <input {...register("guests", {
                    required: "Guest is required",
                    min:{
                        value:1,
                        message:"Guests minimum is 1!"
                    }})}
                    type="number" name="guests" placeholder="guests"
                    className="mt-2 block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-purple-300" />
                    <p className="text-red-500">{errors?.guests?.message}</p>
                    <input {...register("checkIn", {
                    required: "CheckIn is required"})}
                    type="text" name="checkIn" placeholder="checkIn" 
                    className="mt-2 block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-purple-300" />
                    <p className="text-red-500">{errors?.checkIn?.message}</p>
                    <input {...register("checkOut", {
                    required: "CheckOut is required"})}
                    type="text" name="checkOut" placeholder="checkOut" 
                    className="mt-2 block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-purple-300" />
                    <p className="text-red-500">{errors?.checkOut?.message}</p>
                </div>
              )}

              {step === Steps.INFO && (
                <div className="text-black">
                    <p>We will need the following info:</p>
                </div>
              )}

            {step === Steps.PAYMENT && (
                <div className="text-black">
                    <p>Payment</p>
                </div>
              )}
              <button onClick={back}
                className={`mx-8 mt-4 px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-600 
                ${step === Steps.RESERVE ? "hidden" : ""}`}>
                Back
              </button>
              <button onClick={next}
                className={`mx-4 mt-4 px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-600 
                ${step === Steps.FINISH ? "hidden" : ""}`}>
                Next
              </button>
              {step === Steps.FINISH && (
                <button onClick={handleSubmit(handleSubmitReservation)}
                  className="mx-4 mt-4 px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-600">
                  Confirm
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReservationModal;
