'use client';
import { safeReservation } from "@/app/types/type";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ReservationCardProps{
    reservation : safeReservation;
}
const ReservationCard = ( {reservation} : ReservationCardProps) => {
    const router = useRouter();
    const handleCancel = async () => {
        const data = {
            id: reservation.id,
            status: 'Canceled',
          };
        const response = await fetch("/api/reservation", {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          if (response.ok) {
            toast.success("Cancelled");
            router.refresh();
          } else {
            toast.error(response.headers.get("message") || "Update failed");
          }


    }
    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-full mb-4 mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{reservation.unitTitle}</h2>
                <span className="text-sm text-gray-500">{reservation.checkIn} - {reservation.checkOut}</span>
            </div>
            <div className="mb-4">
                {/* <p className="text-gray-700"><strong>Location:</strong> {reservation.unit.accommodation.location.city}, {reservation.unit.accommodation.location.country}</p> */}
                <p className="text-gray-700"><strong>Guests:</strong> {reservation.guests}</p>
            </div>
            <div className="flex items-center">
                <div>
                   <p>Status : {reservation.status}</p>
                    <p className="text-gray-700"><strong>Guest:</strong> {reservation.guest}</p>
                    {/* <p className="text-gray-700"><strong>Email:</strong> {reservation.user.email}</p> */}
                </div>
            </div>
            {reservation.status !=='Canceled' && (
            <div className="flex justify-center mt-4">
                <button onClick={handleCancel} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
            </div>
            )}
        </div>
    );
};

export default ReservationCard;
