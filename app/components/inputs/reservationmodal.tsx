import React, { useState } from "react";
import toast from "react-hot-toast";
import ModalBase from "../cards/modalbase";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkoutform";
import { useRouter } from "next/navigation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkIn: string;
  checkOut: string;
  guests: string;
  email: string;
  unitId: number;
  price: number;
}

enum Steps {
  RESERVE,
  PAYMENT,
  FINISH,
}

const stripePromise = loadStripe('pk_test_51PJFg4AhLSjHhMlaHrxJpEw3HlsfoweBNfevwd57QzE6ASI6OCKS6Ay2wWxE4pcPUjySADaUiipELB1XBpCiVrDW00FtviylsL');

const ReservationModal: React.FC<ModalProps> = ({ isOpen, onClose, checkIn, checkOut, guests, email, unitId, price }) => {
  const [step, setStep] = useState(Steps.RESERVE);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentId, setPayment] = useState<string | null>(null);
  const router = useRouter();


  const handlePaymentIntent = async () => {
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      body: JSON.stringify({ price }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      toast.error("Failed to fetch payment intent.");
      return;
    }

    const data = await response.json();
    setClientSecret(data);
  };

  const handleSubmitReservation = async () => {
    const data = {
      checkIn,
      checkOut,
      guests,
      email,
      unitId,
      paymentId, 
      price
    };

    const response = await fetch("/api/reservation", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      toast.success("Reservation success");
      router.push("/reservations");
      onClose();
    } else {
      const errorMessage = response.headers.get("message");
      toast.error(errorMessage || "Reservation failed");
    }
  };

  const back = () => {
    if (step > Steps.RESERVE) {
      setStep((prevStep) => prevStep - 1);
    }
  };

  const next = () => {
    if (step === Steps.RESERVE && clientSecret === null) {
      handlePaymentIntent();
    }
    if (step === Steps.PAYMENT && paymentId === null) {
      return; 
    }
    setStep((prevStep) => prevStep + 1);
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900">{Steps[step]}</h3>
      </div>
      {step === Steps.RESERVE && (
        <div className="text-black">
          <p>Is this information correct?</p>
          <p>Guests: {guests}</p>
          <p>Check-in: {checkIn}</p>
          <p>Check-out: {checkOut}</p>
          <p>Price: €{price}</p>
        </div>
      )}
      {step === Steps.PAYMENT && (
    
        <div className="text-black">
          {clientSecret && (
            
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm onSuccess={(id:string)=>setPayment(id)} clientSecret={clientSecret} />
            </Elements>
          )}
        </div>
     
      )}
      {step === Steps.FINISH && (
        <div className="text-black">
          <p>Reservation and payment completed successfully!</p>
        </div>
      )}
      <div className="bottom-3 left-0 w-full flex justify-center">
        {step !== Steps.RESERVE && (
          <button onClick={back} className="form_button">
            Back
          </button>
        )}
        <button onClick={next} className="form_button">
          Next
        </button>
        {step === Steps.FINISH && (
          <button onClick={handleSubmitReservation} className="form_button">
            Confirm
          </button>
        )}
      </div>
    </ModalBase>
  );
};

export default ReservationModal;
