'use client';
import { $Enums } from "@prisma/client";
import CustomCalendar from "../inputs/customcalendar";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
    images: string[];
    reservations: [];
    prices: { price: number; from: Date; to: Date; }[];
  };
  user: SafeUser | null;
}

const UnitCard = ({ unit, user }: UnitCardProps) => {
  const searchParams = new URLSearchParams(useSearchParams());
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || "");
  const [guests, setGuests] = useState(searchParams.get("guests") || "");
  const [checkInHidden, setCheckInHidden] = useState(true);
  const [checkOutHidden, setCheckOutHidden] = useState(true);
  const [reservationRequested, setReservationRequested] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const router = useRouter();

  useEffect(() => {
    calculatePrice();
  }, [checkIn, checkOut, guests]);

  const handleReserveClick = () => {
    if (!user) {
      toast.error("Please login to reserve!");
      return;
    }
    if (!reservationRequested) {
      setReservationRequested(true);
      return;
    }
    if (!checkIn || !checkOut || !guests) {
      toast.error("All fields are required!");
      return;
    }
    if (parseInt(guests) > unit.capacity) {
      toast.error("Guests exceed capacity!");
      return;
    }
    setReserveOpen(true);
  };

  const handleFavourite = async (action: string) => {
    if (!user) {
      toast.error("Please login to like the unit!");
      return;
    }
    const response = await fetch("/api/favourite", {
      method: action,
      body: JSON.stringify({ unitId: unit.id, email: user.email }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      toast.success(action === 'DELETE' ? "Unliked" : "Liked");
      router.refresh();
    } else {
      const errorMessage = await response.text();
      toast.error(errorMessage);
    }
  };

  const showCheckIn = () => {
    setCheckInHidden(!checkInHidden);
    setCheckOutHidden(true);
  };

  const showCheckOut = () => {
    setCheckOutHidden(!checkOutHidden);
    setCheckInHidden(true);
  };

  const handleDateSelect = (date: Date, setDate: (date: string) => void, hideCalendar: () => void) => {
    setDate(date ? date.toDateString() : "");
    hideCalendar();
  };

  const calculatePrice = () => {
    if (!checkIn || !checkOut) {
      setCalculatedPrice(0);
      return;
    }

    let total = 0;
    let currentDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    while (currentDate < endDate) {
      const applicablePrice = unit.prices.find(price =>
        price.from.getDate() <= currentDate.getDate() && price.to >= currentDate
      );
      if (applicablePrice) {
        total += applicablePrice.price;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setCalculatedPrice(total);
  };

  return (
    <div className="rounded-lg shadow-md border border-gray-200 p-4">
      {user && (
        user.favourites.find(fav=>fav===unit.id) 
          ? <IoIosHeart onClick={() => handleFavourite('DELETE')} className="left-2 h-8 w-6 cursor-pointer" />
          : <IoIosHeartEmpty onClick={() => handleFavourite('POST')} className="left-2 h-8 w-6 cursor-pointer" />
      )}
      <div className="grid grid-cols-2 py-4 gap-1 mx-10">
        {unit.images.map((image, index) => (
          <img src={image} key={index} alt="Image" className="h-60 w-full object-fit object-cover" />
        ))}
      </div>
      <h3 className="text-lg font-semibold mb-4">{unit.type} {unit.title}</h3>
      <p className="text-gray-600 mb-2">{unit.description}</p>
      <p className="text-gray-600 mb-2">Max. guests: {unit.capacity}</p>
      <p className="text-gray-600 mb-2">Amenities:</p>
      <ul>
        {unit.amenities.map((amenity, index) => (
          <li key={index}>{amenity}</li>
        ))}
      </ul>
      {reservationRequested && (
        <div className="w-80 flex flex-col gap-4">
          <div className="flex-1">
            <label htmlFor="checkIn" className="block mb-2">Check in:</label>
            <input
              id="checkIn"
              type="text"
              placeholder="Select date"
              value={checkIn}
              onClick={showCheckIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="form-input"
            />
            <CustomCalendar
            prices={unit.prices}
              reservations={unit.reservations}
              selected={checkIn}
              onSelect={(date) => handleDateSelect(date, setCheckIn, () => setCheckInHidden(true))}
              hidden={checkInHidden}
              disabledAfter={checkOut ? new Date(checkOut) : undefined}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="checkOut" className="block mb-2">Check out:</label>
            <input
              id="checkOut"
              type="text"
              placeholder="Select date"
              value={checkOut}
              onClick={showCheckOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="form-input"
            />
            <CustomCalendar
            prices={unit.prices}
              reservations={unit.reservations}
              selected={checkOut}
              onSelect={(date) => handleDateSelect(date, setCheckOut, () => setCheckOutHidden(true))}
              hidden={checkOutHidden}
              disabledBefore={checkIn ? new Date(checkIn) : undefined}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="guests" className="block mb-2">Guests:</label>
            <input
              id="guests"
              type="number"
              min={1}
              max={unit.capacity}
              placeholder="Number of guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="form-input"
            />
          </div>
            <p className="text-gray-600 mb-2">Total Price: €{calculatedPrice}</p>
        </div>
      )}
      <button onClick={handleReserveClick} className="form_button">
        {reservationRequested ? "Confirm Reservation" : "Reserve"}
      </button>
      {user &&(
        <ReservationModal
          email={user.email}
          unitId={unit.id}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          price={calculatedPrice}
          isOpen={reserveOpen}
          onClose={() => { setReserveOpen(false); setReservationRequested(false) }}
        />
      )}
    </div>
  );
};

export default UnitCard;
