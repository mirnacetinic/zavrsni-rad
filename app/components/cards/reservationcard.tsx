'use client';
import { safeReservation } from "@/app/types/type";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ReviewModal from "../inputs/reviewmodal";
import { MdOutlineStarPurple500 } from "react-icons/md";
import CheckoutForm from "../inputs/checkoutform";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useState } from "react";
import ModalBase from "./modalbase";

interface ReservationCardProps{
    reservation : safeReservation;
    email : string;
}

const stripePromise = loadStripe('pk_test_51PJFg4AhLSjHhMlaHrxJpEw3HlsfoweBNfevwd57QzE6ASI6OCKS6Ay2wWxE4pcPUjySADaUiipELB1XBpCiVrDW00FtviylsL');


const ReservationCard = ( { reservation, email } : ReservationCardProps) => {
    const router = useRouter();
    const now = new Date();
    now.setHours(0,0,0,0);
    const [open, setOpen] = useState(false);

    const handleStatus = async (status: string, paymentId? : string) => {
        const data = {
            id : reservation.id,
            status : status,
            paymentId : paymentId || reservation.paymentId
        };
        const response = await fetch("/api/reservation", {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          if (response.ok) {
            toast.success(status);
            router.refresh();
          } else {
            toast.error(response.headers.get("message") || "Update failed");
          }


    }
    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-full mb-4 mx-auto">
            <div className="flex items-center justify-between mb-4">
                <Link href={`/accommodations/${reservation.accommodation}`}>
                    <h2 className="cursor-pointer text-xl font-semibold text-gray-800">{reservation.unitTitle}</h2>
                </Link>
                <div className="flex flex-col items-center">
                <span className="text-sm text-gray-500">{reservation.checkIn} - {reservation.checkOut}</span>
                <span className="text-lg font-semibold">€{reservation.price}</span>
                </div>
            </div>
            <div className="mb-4">
                <p className="text-gray-700"><strong>Guests:</strong> {reservation.guests}</p>
                <p className="text-gray-700"><strong>Status :</strong> {reservation.status}</p>
                <p className="text-gray-700"><strong>Guest :</strong> {reservation.guest}</p>
            </div>
            {reservation.review && (
            <div className="flex justify-end">
                <strong>Your rating:</strong>
                {[...Array(reservation.review)].map((_, index) => (
                <MdOutlineStarPurple500 key={index} className="text-purple-500" size={25} />
                ))}
            </div>
            )}
            {reservation.status !=='Canceled' &&  new Date(reservation.checkIn) >= now &&(
            <div className="flex justify-center mt-4">
                <button onClick={()=>handleStatus('Canceled')} className="form_button">Cancel</button>
                {reservation.status === "Accepted" && (
                    <div>
                    <button onClick={()=>setOpen(true)} className="form_button">Pay</button>
                    <ModalBase isOpen={open} onClose={()=>setOpen(false)}>
                    <Elements stripe={stripePromise} options={{clientSecret : reservation.paymentId}}>
                        <CheckoutForm email={email} unit={reservation.unitTitle} price={reservation.price} onSuccess={(id: string) => {setOpen(false); handleStatus('Active', id);}} clientSecret={reservation.paymentId} />
                    </Elements>
                    </ModalBase>
                    </div>
                )}
            </div>
            )}
            {reservation.status ==='Active' && !reservation.review && new Date(reservation.checkOut) < now &&(
                <div className="flex justify-center mt-4">
                <ReviewModal reservationId={reservation.id} />
                </div>
            )}
        </div>
    );
};

export default ReservationCard;
