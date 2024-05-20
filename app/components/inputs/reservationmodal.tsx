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
        setStep(Steps.RESERVE);
        router.push('/reservations');
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
                    type="number" readOnly name="guests" placeholder="guests"
                    className="form-input" />
                    <p className="error">{errors?.guests?.message}</p>
                    <input {...register("checkIn", {
                    required: "CheckIn is required"})}
                    type="text" readOnly name="checkIn" placeholder="checkIn" 
                    className="form-input" />
                    <p className="error">{errors?.checkIn?.message}</p>
                    <input {...register("checkOut", {
                    required: "CheckOut is required"})}
                    type="text" readOnly name="checkOut" placeholder="checkOut" 
                    className="form-input" />
                    <p className="error">{errors?.checkOut?.message}</p>
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
              <div className="bottom-3 left-0 w-full flex justify-center">
              <button onClick={back}
                className={`form_button 
                ${step === Steps.RESERVE ? "hidden" : ""}`}>
                Back
              </button>
              <button onClick={next}
                className={`form_button 
                ${step === Steps.FINISH ? "hidden" : ""}`}>
                Next
              </button>
              {step === Steps.FINISH && (
                <button onClick={handleSubmit(handleSubmitReservation)}
                  className="form_button">
                  Confirm
                </button>
              )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReservationModal;
