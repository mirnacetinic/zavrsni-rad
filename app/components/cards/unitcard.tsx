'use client';
import { $Enums } from "@prisma/client";
import CustomCalendar from "../inputs/customcalendar";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReservationModal from "../inputs/reservationmodal";
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import { SafeUnit, SafeUser } from "@/app/types/type";

interface UnitCardProps {
  key: number;
  unit: SafeUnit;
  user: SafeUser | null;
}

const UnitCard = ({ unit, user }: UnitCardProps) => {
  const searchParams = useSearchParams();
  const [checkIn, setCheckIn] = useState<Date | null>(searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')!) : null);
  const [checkOut, setCheckOut] = useState<Date | null>(searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')!) : null);
  const [guests, setGuests] = useState(searchParams?.get("guests") || "");
  const [checkInHidden, setCheckInHidden] = useState(true);
  const [checkOutHidden, setCheckOutHidden] = useState(true);
  const [reservationRequested, setReservationRequested] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (searchParams) {
      if (parseInt(guests) > unit.capacity) {
        setGuests("");
      }

      if (unit.reservations?.some(r => {
        const newCheckIn = checkIn ? new Date(checkIn) : null;
        const newCheckOut = checkOut ? new Date(checkOut) : null;

        return (
          (newCheckIn && newCheckOut && newCheckIn >= new Date(r.checkIn) && newCheckIn < new Date(r.checkOut)) ||
          (newCheckOut && newCheckOut > new Date(r.checkIn) && newCheckOut <= new Date(r.checkOut)) ||
          (newCheckIn && newCheckIn <= new Date(r.checkIn) && newCheckOut && newCheckOut >= new Date(r.checkOut))
        );
      })) {
        setCheckIn(null);
        setCheckOut(null);
      }
    }
  }, [checkIn, checkOut, guests, unit.capacity, unit.reservations]);

  useEffect(() => {
    calculatePrice();
  }, [checkIn, checkOut]);

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
    if (parseInt(guests) < 1) {
      toast.error("Minimum guests is 1!");
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
      toast.error(response.headers.get("message"));
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

  const handleDateSelect = (date: Date | null, setDate: (date: Date | null) => void, hideCalendar: () => void) => {
    setDate(date);
    hideCalendar();
  };

  const calculatePrice = () => {
    if (!checkIn || !checkOut) {
      setCalculatedPrice(0);
      return;
    }

    let total = 0;
    let currentDate = new Date(checkIn);

      while (currentDate < checkOut) {
        const applicablePrice = unit.priceLists.find(price =>
          price.from <= currentDate && price.to >= currentDate
        );
        if (applicablePrice) {
          let price = applicablePrice.price;
          if (applicablePrice.deal) {
            const discount = applicablePrice.deal / 100; 
            price -= price * discount;
          }
          total += price;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setCalculatedPrice(total);

  };

  return (
    <div className="rounded-lg shadow-md border border-gray-200 p-4">
      {user && (
        user.favourites.find(fav => fav === unit.id) 
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
      <p className="text-gray-600 mb-2">Maximum guests: {unit.capacity}</p>
      {unit.amenitiesName && unit.amenitiesName.length >0 && ( <p className="text-gray-600 mb-2">Amenities:</p> )}
      <ul>
        {unit.amenitiesName?.map((amenity, index) => (
          <li key={index}>{amenity}</li>
        ))}
      </ul>
      {reservationRequested && (
        <div className="w-80 flex flex-col gap-4">
          <div className="flex-1">
            <label htmlFor="checkIn" className="block mb-2">Check in:</label>
            <input readOnly id="checkIn" type="text" placeholder="Select date"
              value={checkIn ? checkIn.toDateString() : ""} onClick={showCheckIn} className="form-input"
            />
            <CustomCalendar prices={unit.priceLists} reservations={unit.reservations}
              selected={checkIn} onSelect={(date) => handleDateSelect(date, setCheckIn, () => setCheckInHidden(true))}
              hidden={checkInHidden} disabledAfter={checkOut || undefined}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="checkOut" className="block mb-2">Check out:</label>
            <input readOnly id="checkOut" type="text" placeholder="Select date"
              value={checkOut ? checkOut.toDateString() : ""} onClick={showCheckOut} className="form-input"
            />
            <CustomCalendar prices={unit.priceLists} reservations={unit.reservations}
              selected={checkOut} onSelect={(date) => handleDateSelect(date, setCheckOut, () => setCheckOutHidden(true))}
              hidden={checkOutHidden} disabledBefore={checkIn || undefined}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="guests" className="block mb-2">Guests:</label>
            <input id="guests" type="number" min={1} max={unit.capacity} placeholder="Number of guests"
              value={guests} onChange={(e) => setGuests(e.target.value)} className="form-input"
            />
          </div>
          <p className="text-gray-600 mb-2">Total Price: €{calculatedPrice}</p>
          {unit.inquiry && <p>This is inquiry based</p>}
        </div>
      )}
      <button onClick={handleReserveClick} className="form_button">
        {reservationRequested ? (unit.inquiry ? "Confirm inquiry" : "Confirm Reservation") : (unit.inquiry ? "Send inquiry" : "Reserve")}
      </button>
      {user && (
        <ReservationModal email={user.email} unit={unit} checkIn={checkIn ? checkIn.toDateString() : ""} checkOut={checkOut ? checkOut.toDateString() : ""}
          guests={guests} price={calculatedPrice}
          isOpen={reserveOpen} onClose={() => setReserveOpen(false)}
        />
      )}
    </div>
  );
};

export default UnitCard;
