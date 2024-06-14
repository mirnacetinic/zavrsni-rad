import React, { useState} from "react";
import toast from "react-hot-toast";
import ModalBase from "../cards/modalbase";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkoutform";
import { useRouter } from "next/navigation";
import { SafeUnit } from "@/app/types/type";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkIn: string;
  checkOut: string;
  guests: string;
  email: string;
  unit : SafeUnit;
  price: number;
}

enum Steps {
  SUMMARY,
  PAYMENT,
  FINISH,
}


const stripePromise = loadStripe('pk_test_51PJFg4AhLSjHhMlaHrxJpEw3HlsfoweBNfevwd57QzE6ASI6OCKS6Ay2wWxE4pcPUjySADaUiipELB1XBpCiVrDW00FtviylsL');

const ReservationModal: React.FC<ModalProps> = ({ isOpen, onClose, checkIn, checkOut, guests, email, unit, price }) => {
  const [step, setStep] = useState(Steps.SUMMARY);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [intentPrice, setIntentPrice] = useState<number | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePaymentIntent = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price }),
      });
      if (!response.ok) {
        toast.error("Failed to create payment intent.");
        return;
      }
      const data = await response.json();
      setClientSecret(data.client_secret);
      setIntentPrice(data.amount / 100);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const sendConfirmation = async (type: "res"| "inq") => {
    const messages = {
      res: {
        subject: "Reservation Confirmation",
        message: `<p>Dear Guest,</p>
        <div>Your reservation at ${unit.type+' '+ unit.title} is confirmed.
         <div><p>Address: ${unit.address}</p><p> Check-in: ${checkIn} Check-out: ${checkOut}</p> <p>Guests: ${guests}</p> </div>
          <p>We look forward to your stay.</p>
        </div>`,
      },
      inq: {
        subject: "Inquiry Confirmation",
        message: `<p>Dear Guest,</p><p>Thank you for your inquiry. We will notify you once the host reviews your request.</p>`,
      },
    };

    try {
      const { subject, message } = messages[type];
      const response = await fetch("/api/mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subject, message }),
      });
      if (!response.ok) {
         toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleSubmitReservation = async (id?: string) => {
    setLoading(true);
    toast.loading("Submitting your reservation...");

    const data = {
      checkIn,
      checkOut,
      guests,
      email,
      unitId : unit.id,
      status: unit.inquiry ? 'Inquiry' : 'Active',
      wasInquiry: unit.inquiry ? "true" : "",
      paymentId: unit.inquiry ? clientSecret : id,
      price,
    };

    if (!unit.inquiry && !id) {
      toast.error("Missing payment information");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Reservation successful");
        sendConfirmation(unit.inquiry ? "inq" : "res");
      } else {
        toast.error(response.headers.get("message") || "Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  };

  const back = () => {
    if (step > Steps.SUMMARY) setStep((prevStep) => prevStep - 1);
  };

  const next = () => {
    if (step === Steps.SUMMARY && (clientSecret === null || price !== intentPrice)) {
      handlePaymentIntent();
    }
    if (step === Steps.PAYMENT && paymentId === null) {
      if (!unit.inquiry) {
        toast.error("Payment is required to continue!");
        return;
      }
      setPaymentId(clientSecret);
      handleSubmitReservation();
    }
    setStep((prevStep) => prevStep + 1);
  };

  return (
    <ModalBase isOpen={isOpen} onClose={() => { onClose(); setStep(Steps.SUMMARY); }} width="w-96">
      <div>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900">{Steps[step]}</h3>
      </div>
      {step === Steps.SUMMARY && (
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
          {loading || !clientSecret ? (
            <p>Loading...</p>
          ) : (
            <>
              {unit.inquiry ? (
                <p>You do not need to pay right now, we will prompt you to pay after the host accepts this inquiry.</p>
              ) : paymentId ? (
                <p>Payment success. Amount paid: €{price}</p>
              ) : (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm
                    email={email}
                    unit={unit.title}
                    price={price}
                    onSuccess={(id: string) => { setPaymentId(id); handleSubmitReservation(id); }}
                    clientSecret={clientSecret}/>
                </Elements>
              )}
            </>
          )}
        </div>
      )}

      {step === Steps.FINISH && (
        <div className="text-black">
          {loading?
          <p>Loading...</p>
          :
          unit.inquiry ? (
            <div>Perfect! We have everything we need for now. We have sent you details about your inquiry to your email. You will receive an email when the host accepts or denies your inquiry.</div>
          ) : (
            <div>Perfect! We have everything we need. Your reservation is now confirmed and you have received confirmation and check-in information via email! Safe travels!</div>
          )}
        </div>
      )}
      <div className="bottom-3 left-0 w-full flex justify-center">
        {!loading && step !== Steps.SUMMARY && <button onClick={back} className="form_button">Back</button>}
        {!loading && step !== Steps.FINISH && <button onClick={next} className="form_button">Next</button>}
        {step === Steps.FINISH && !loading && <button onClick={() =>{ onClose(); router.push("/reservations")}} className="form_button">Finish</button>}
      </div>

      </div>
    </ModalBase>
  );
};

export default ReservationModal;
