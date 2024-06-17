'use client';
import { useState, useEffect } from "react";
import { SafeAccommodation, SafeUnit, SafeUser } from "@/app/types/type";
import HostModal from "../inputs/hostmodal";
import { FieldValues } from "react-hook-form";
import toast from "react-hot-toast";
import UnitModal from "../inputs/unitmodal";
import { useRouter } from "next/navigation";
import { Amenity, Location } from "@prisma/client";
import CustomCalendar from "../inputs/customcalendar";

interface HostProps {
  accommodations: SafeAccommodation[];
  user: SafeUser;
  amenities: Amenity[];
  locations: Location[];
}

const HostCard: React.FC<HostProps> = ({
  accommodations,
  user,
  amenities,
  locations,
}) => {
  const router = useRouter();
  const [selectedAccommodationId, setSelectedAccommodationId] = useState<number | null>(null);
  const [unitEdit, setUnitEdit] = useState(false);
  const [unitAdd, setUnitAdd] = useState(false);
  const [expandedUnitId, setExpandedUnitId] = useState<number | null>(null);
  const [expandedPriceListId, setExpandedPriceListId] = useState<number | null>(null);
  const [expandedDatesId, setExpandedDatesId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [search, setSearch] = useState("");
  const [filteredAccommodations, setFilteredAccommodations] = useState<SafeAccommodation[]>(accommodations);

  const handleDates = ([date1, date2]: [Date | null, Date | null]) => {
    setStartDate(date1);
    setEndDate(date2);
  };

  const handleUnit = async (data: FieldValues, acc?: number) => {
    if (acc) data.accommodationId = acc;
    const method = unitEdit ? "PUT" : "POST";
    const response = await fetch("/api/unit", {
      method,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      toast.success(response.headers.get("message") || "Success");
      router.refresh();
      setUnitAdd(false);
      setUnitEdit(false);
    } else {
      toast.error(response.headers.get("message") || "Error");
    }
  };

  const handleDelete = async (id: number, route: string) => {
    const response = await fetch(route, {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      toast.success(response.headers.get("message"));
      router.refresh();
    } else {
      toast.error(response.headers.get("message") || "Error");
    }
  };

  const handleCloseDates = async (id: number, closedDates? : {id: number, start:Date, end:Date}[]) => {
    if(!startDate || !endDate) return;

    if(closedDates){
      closedDates.filter(e=>e.start>startDate && e.end<endDate).map(e=> handleDelete(e.id, "/api/prices"));

    }

    const response = await fetch("/api/prices", {
      method: "POST",
      body: JSON.stringify({ data: { unitId: id, from: startDate, to: endDate, closed: "true", price: 0 } }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      toast.success("Closed");
      setStartDate(null);
      setEndDate(null);
      router.refresh();
    } else {
      toast.error(response.headers.get("message") || "Error");
    }
  
  };

  const handleDeals = async ( deal: number, ids?: number[], id?: number) => {
    const response = await fetch("/api/prices", {
      method: "PUT",
      body: JSON.stringify({ ids: ids, id: id, deal: deal }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      toast.success("Success");
      router.refresh();
    } else {
      toast.error(response.headers.get("message") || "Error");
    }
  };

  const toggleExpandUnit = (unitId: number) => {
    setExpandedUnitId((prev) => (prev === unitId ? null : unitId));
  };

  const toggleExpandPriceList = (priceListId: number) => {
    setExpandedPriceListId((prev) => (prev === priceListId ? null : priceListId));
  };

  const toggleExpandDates = (datesId: number) => {
    setExpandedDatesId((prev) => (prev === datesId ? null : datesId));
  };

  const safeUnit = (unit: SafeUnit) => {
    const { reservations, amenitiesName, closedDates, ...safeUnit } = unit;
    return safeUnit;
  };

  const safeAccommodation = (accommodation: SafeAccommodation) => {
    const safeAccommodation = {
      ...accommodation,
      units: accommodation.units?.map((u) => safeUnit(u)),
    };
    return safeAccommodation;
  };

  useEffect(() => {
    const filtered = accommodations.filter((accommodation) => {
      const searchTerm = search.toLowerCase();
      const matchAccommodation = accommodation.title.toLowerCase().includes(searchTerm) ||
        accommodation.type.toLowerCase().includes(searchTerm) ||
        accommodation.address.toLowerCase().includes(searchTerm) ||
        accommodation.city.toLowerCase().includes(searchTerm) ||
        accommodation.country.toLowerCase().includes(searchTerm);

      const matchUnits = accommodation.units?.some((unit) => {
        return unit.title.toLowerCase().includes(searchTerm) ||
          unit.type.toLowerCase().includes(searchTerm) ||
          unit.description.toLowerCase().includes(searchTerm);
      });

      return matchAccommodation || matchUnits;
    });

    setFilteredAccommodations(filtered);
  }, [search, accommodations]);

  return (
    <>
      <div className="p-4">
        <input
          type="text"
          placeholder="Search accommodations and units"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
      </div>
      {filteredAccommodations.map((accommodation, index) => (
        <div key={index} className="p-6 bg-white border border-gray-200 rounded-lg shadow-md mb-4">
          <UnitModal
            amenities={amenities}
            isOpen={unitAdd}
            onClose={() => setUnitAdd(false)}
            onAddUnit={(data) => handleUnit(data, accommodation.id)}
          />
          <HostModal
            user={user}
            accommodation={safeAccommodation(accommodation)}
            locationsList={locations}
            isOpen={selectedAccommodationId === accommodation.id}
            onClose={() => setSelectedAccommodationId(null)}
          />
          <div className="flex justify-between items-center m-2">
            <div>
              {accommodation.image && (<img src={accommodation.image} width={400} height={300} />)}
              <h2 className="text-xl font-bold">{accommodation.title}</h2>
              <p className="text-gray-600">{accommodation.type}</p>
              <p className="text-gray-600">
                {accommodation.address}, {accommodation.city},{" "}
                {accommodation.country}
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setSelectedAccommodationId(accommodation.id)}>
                Edit
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => setUnitAdd(true)}>
                Add Unit
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleDelete(accommodation.id, "/api/accommodation")} >
                Delete
              </button>
              {accommodation.units && (
                <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600" onClick={() => handleDeals(10,accommodation.units?.map(u => u.id) || [])}>
                  Add 10% off
                </button>
              )}
            </div>
          </div>
          <p className="text-gray-800 mb-4">{accommodation.description}</p>
          <p className="text-gray-600 mb-4">Status: {accommodation.status}</p>
          {accommodation.units && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Units:</h3>
              {accommodation.units.map((unit) => (
                <div key={unit.id} className="mb-4">
                  <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg cursor-pointer"
                    onClick={() => toggleExpandUnit(unit.id)}>
                    <p className="font-semibold">{unit.title}</p>
                    <p>{expandedUnitId === unit.id ? "-" : "+"}</p>
                  </div>
                  {expandedUnitId === unit.id && (
                    <div className="border rounded-lg p-4 bg-white mt-2">
                      <div className="flex flex-row justify-center">
                        {unit.images?.map((i) => (
                          <img key={i} className="m-1" alt="Pic" src={i} height={200} width={200}></img>
                        ))}
                      </div>
                      <p>Type: {unit.type}</p>
                      <p>Description: {unit.description}</p>
                      <p>Capacity: {unit.capacity}</p>
                      <p>Amenities: {unit?.amenitiesName?.join(", ")}</p>
                      <p>Inquiry: {unit.inquiry.toString()}</p>
                      {unit.priceLists.length > 0 && (
                        <div className="mt-4">
                          <div
                            className="flex justify-between items-center bg-gray-100 p-3 rounded-lg cursor-pointer"
                            onClick={() => toggleExpandPriceList(unit.id)}>
                            <p className="font-semibold">Price lists</p>
                            <p>{expandedPriceListId === unit.id ? "-" : "+"}</p>
                          </div>
                          {expandedPriceListId === unit.id && (
                            <div className="mt-2">
                              {unit.priceLists.map((price) => (
                                <div key={price.id} className="p-2 mt-1 border bg-gray-200 rounded">
                                  <p>From: {price.from.toLocaleDateString()}</p>
                                  <p>To: {price.to.toLocaleDateString()}</p>
                                  <p>Price: €{price.price} </p>
                                  <p>Active deals: {price.deal ? (
                                    <>
                                      {price.deal}% <button className="px-2 bg-red-500 rounded text-white" onClick={() => handleDeals(0,undefined,price.id)}>X</button>
                                    </>
                                  ) : (
                                    "None"
                                  )}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="mt-4">
                        <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg cursor-pointer"
                          onClick={() => toggleExpandDates(unit.id)}>
                          <p className="font-semibold">Dates</p>
                          <p>{expandedDatesId === unit.id ? "-" : "+"}</p>
                        </div>
                        {expandedDatesId === unit.id && (
                          <div className="flex flex-row mt-2">
                            <div className="text-center">
                              <CustomCalendar reservations={unit.reservations} hidden={false} closedDates={unit.closedDates}
                                selected={startDate || undefined} secondSelected={endDate || undefined} onTwoSelect={handleDates} 
                              />
                              <div className="text-left">
                                <p className="text-red-500">Reservations</p>
                                <p className="text-purple-500">Closed</p>
                              </div>
                            </div>
                            <div className="mx-2 ">
                              {unit.closedDates && unit.closedDates.length >0 && (
                                <div><b>Closed Dates:</b>
                                {unit.closedDates?.map((c) =>
                                  <p key={c.id}>{ c.start.toDateString() + '-' + c.end.toDateString() } <button className="px-2 bg-red-500 rounded text-white" onClick={()=>handleDelete(c.id, "/api/prices")}>X</button></p>
                                )}
                                </div> 
                              )}
                              {startDate && endDate && (
                                  <button onClick={() => handleCloseDates(unit.id, unit.closedDates)} className="bg-red-200 rounded mt-1 p-1"> Close {startDate?.toDateString() || ""} - {endDate?.toDateString() || ""}</button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600" onClick={() => handleDeals(10, [unit.id])}>
                          Add 10% off
                        </button>
                        <button
                          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          onClick={() => setUnitEdit(true)}>
                          Edit
                        </button>
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={() => handleDelete(unit.id, "/api/unit")}>
                          Remove
                        </button>
                        <UnitModal isOpen={unitEdit} unit={safeUnit(unit)} amenities={amenities} onClose={() => setUnitEdit(false)} onAddUnit={handleUnit}/>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default HostCard;