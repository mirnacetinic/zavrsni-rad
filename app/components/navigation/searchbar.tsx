'use client';
import { useRouter } from "next/navigation";
import { useState} from "react";

const Searchbar = ({ small = false, searchParams }: { small?: boolean; searchParams?: { whereTo?: string; checkIn?: string; checkOut?: string; guests?: string } }) => {
  const router = useRouter();
  const [whereTo, setWhereTo] = useState(searchParams?.whereTo || "");
  const [checkIn, setCheckIn] = useState(searchParams?.checkIn || "");
  const [checkOut, setCheckOut] = useState(searchParams?.checkOut || "");
  const [guests, setGuests] = useState(searchParams?.guests || "");
  const today = new Date().toISOString().split('T')[0];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (whereTo) params.set("whereTo", whereTo);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);

    router.push(`/objects?${params.toString()}`);
  };

  return (
    <div className={`searchbar-container ${small ? "w-60" : "w-full"}`}>
      <div className="searchbar rounded md:rounded-full">
        <div className="flex flex-col md:flex-row items-center justify-between px-4">
          <div className="mb-4 md:mr-2 md:mb-0 flex flex-col items-center w-full md:w-auto">
            <label htmlFor="whereTo" className="searchbar-label">
              Where to:
            </label>
            <input id="whereTo" type="text" placeholder="Enter destination" className="searchbar-input" value={whereTo}
              onChange={(e) => setWhereTo(e.target.value)} />
          </div>
          <div className="mb-4 md:mr-2 md:mb-0 flex flex-col items-center w-full md:w-auto">
            <label htmlFor="checkIn" className="searchbar-label">
              Check in:
            </label>
            <input id="checkIn" type="date" min={today} className="searchbar-input" value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)} />
          </div>
          <div className="mb-4 md:mr-2 md:mb-0 flex flex-col items-center w-full md:w-auto">
            <label htmlFor="checkOut" className="searchbar-label">
              Check out:
            </label>
            <input id="checkOut" type="date" min={today} className="searchbar-input" value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)} />
          </div>
          <div className="mb-4 md:mr-2 md:mb-0 flex flex-col items-center w-full md:w-auto">
            <label htmlFor="guests" className="searchbar-label">
              Guests:
            </label>
            <input id="guests" type="number" min={1} placeholder="Number of guests" className="searchbar-input" value={guests}
              onChange={(e) => setGuests(e.target.value)} />
          </div>
          <div className="text-center mt-4">
            <button className="searchbar-button" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
