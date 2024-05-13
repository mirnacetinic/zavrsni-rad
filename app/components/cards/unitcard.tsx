'use client';
import { $Enums} from "@prisma/client";
import CustomCalendar from "../inputs/customcalendar";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import ReservationModal from "../inputs/reservationmodal";
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import { SafeUser } from "@/app/types/type";

interface UnitCardProps {
    key: number;
    unit: {
        amenities: string[];
        id: number;
        title: string;
        type: $Enums.AccommodationType;
        description: string;
        capacity: number;
        accommodationId: number;
    };
    user : SafeUser | null;
}

const UnitCard = ({  unit, user }: UnitCardProps) => {
    const searchParams = new URLSearchParams(useSearchParams());
    const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || "");
    const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || "");
    const [guests, setGuests] = useState(searchParams.get("guests") || "");
    const [checkInHidden, setcheckInHidden] = useState(true);
    const [checkOutHidden, setcheckOutHidden] = useState(true);
    const [reservationRequested, setReservationRequested] = useState(false);
    const [reserveOpen, setReserveOpen] = useState(false);
    const router = useRouter();

    const handleReserveClick = () => {
        if(!user){
            toast.error("Please login to reserve!");
            
        }
        if (!reservationRequested) {
            setReservationRequested(true);
            return;
        }
        setReserveOpen(true)
    };

    const handleFavourite = async (action: string) =>{
        if(!user){
            toast.error("Please login to like the unit!");
        }
        else{
            const response = await fetch("/api/favourite", {
                method: action,
                body: JSON.stringify({'unitId':unit.id,'email':user.email}),
                headers: {
                  "Content-Type": "application/json",
                },
              });
          
              if (response.ok) {
                toast.success("Success");
                const responseData = await response.json();
                router.refresh();
              } else {
                const errorMessage = await response.text();
                toast.error(errorMessage);
              }
            };
    
    }

    const showCheckIn = () => {
        setcheckInHidden(!checkInHidden);
        setcheckOutHidden(true);
      };
    
      const showCheckOut = () => {
        setcheckOutHidden(!checkOutHidden);
        setcheckInHidden(true);
      };
    
      const handleCheckInSelect = (date:Date) => {
        setCheckIn(date !== null ? date.toDateString() : "");
        setcheckInHidden(true); 
      };
    
      const handleCheckOutSelect = (date:Date) => {
        setCheckOut(date !== null ? date.toDateString() : "");
        setcheckOutHidden(true); 
      };


      return (
        <div className="rounded-lg shadow-md border border-gray-200 p-4">
            {user && (
            <>
            {user.favourites.find(fav=>fav===unit.id)? <IoIosHeart onClick={()=>handleFavourite('DELETE')} className="left-2 h-8 w-6"/>  : <IoIosHeartEmpty onClick={()=>handleFavourite('POST')} className="left-2 h-8 w-6"/> }
            </>
            )}
            <div className="grid grid-cols-2 py-4 mx-20 gap-1 mb-4">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="h-48 w-auto bg-gray-300"></div> 
                        ))}
            </div>
            <h3 className="text-lg font-semibold mb-4">{unit.type} {unit.title}</h3>
            <p className="text-gray-600 mb-2">{unit.description}</p>
            <p className="text-gray-600 mb-4">Max. guests: {unit.capacity}</p>
            {reservationRequested && (
            <div className="w-80 flex flex-col gap-4">
                <div className="flex-1">
                    <label htmlFor="checkIn" className="block mb-2">Check in:</label>
                    <input id="checkIn" type="text"placeholder="Select date" value={checkIn} onClick={showCheckIn} onChange={(e) => setCheckIn(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"/>
                    <CustomCalendar selected={checkIn} onSelect={handleCheckInSelect} hidden={checkInHidden} />
                </div>
                <div className="flex-1">
                    <label htmlFor="checkOut" className="block mb-2">Check out:</label>
                    <input id="checkOut" type="text" placeholder="Select date" onChange={(e) => setCheckOut(e.target.value)} value={checkOut} onClick={showCheckOut}
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"/>
                    <CustomCalendar selected={checkOut} onSelect={handleCheckOutSelect} hidden={checkOutHidden} />
                </div>
                <div className="flex-1">
                    <label htmlFor="guests" className="block mb-2">Guests:</label>
                    <input id="guests" type="number" min={1} placeholder="Number of guests" value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-purple-500"/>
                </div>
            </div>)}
            <button onClick={handleReserveClick} className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition duration-300">
                {reservationRequested ? "Confirm Reservation" : "Reserve"}
            </button>
            {user && (
            <ReservationModal email={user.email} unitId={unit.id} checkIn={checkIn} checkOut={checkOut} guests={guests} isOpen={reserveOpen} onClose={()=>{setReserveOpen(false); setReservationRequested(false)}}/>
        )}
        </div>
    );
};

export default UnitCard;