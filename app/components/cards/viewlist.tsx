"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { FaSort, FaFilter } from "react-icons/fa";
import AccomodationCard from "./accomodationcard";
import { SearchAccommodation } from "@/app/types/type";

// Custom hook to detect clicks outside an element
function useOutsideClick(ref: any, callback: any) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

interface ViewProps {
  accommodations: SearchAccommodation[];
}

interface Filters {
  amenities: string[];
  type: string;
  price: [number, number];
  rating: number;
}

interface SortOptions {
  sortBy: "rating" | "popularity" | "price";
  sortOrder: "asc" | "desc";
}

const ViewList = ({ accommodations }: ViewProps) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [filteredData, setFilteredData] = useState<SearchAccommodation[]>(accommodations);
  const [filters, setFilters] = useState<Filters>({
    amenities: [],
    type: "",
    price: [0, 1000],
    rating: 0,
  });
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    sortBy: "price",
    sortOrder: "asc",
  });

  const sortRef = useRef(null);
  const filterRef = useRef(null);

  useOutsideClick(sortRef, () => setSortOpen(false));
  useOutsideClick(filterRef, () => setFilterOpen(false));

  const handleFilter = useCallback((filterType: keyof Filters, value: string | number | [number, number]) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      if (filterType === "amenities" && typeof value === "string") {
        if (newFilters.amenities.includes(value)) {
          newFilters.amenities = newFilters.amenities.filter((item) => item !== value);
        } else {
          newFilters.amenities.push(value);
        }
      } else if (filterType === "price" && Array.isArray(value)) {
        newFilters.price = value;
      } else if (filterType === "rating" && typeof value === "number") {
        newFilters.rating = value;
      } else if (filterType === "type" && typeof value === "string") {
        newFilters.type = value;
      }
      return newFilters;
    });
  }, []);

  const handleSort = useCallback((sortBy: "rating" | "popularity" | "price") => {
    setSortOptions((prevSortOptions) => {
      const sortOrder = prevSortOptions.sortOrder === "asc" ? "desc" : "asc";
      return { sortBy, sortOrder };
    });
  }, []);

  const applyFiltersAndSort = useCallback(() => {
    let data = accommodations;
    if (filters.amenities.length > 0) {
      data = data.filter((acc) => filters.amenities.every((filter) => acc.amenities.includes(filter)));
    }
    if (filters.type) {
      data = data.filter((acc) => acc.type === filters.type);
    }
    if (filters.price) {
      data = data.filter((acc) => acc.price >= filters.price[0] && acc.price <= filters.price[1]);
    }
    if (filters.rating) {
      data = data.filter((acc) => acc.rating >= filters.rating);
    }

    const sortedData = data.sort((a, b) => {
      const sortOrder = sortOptions.sortOrder === "asc" ? 1 : -1;
      return sortOrder * (a[sortOptions.sortBy] - b[sortOptions.sortBy]);
    });

    setFilteredData(sortedData);
  }, [accommodations, filters, sortOptions]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [filters, sortOptions, applyFiltersAndSort]);

  useEffect(() => {
    setFilteredData(accommodations);
  }, [accommodations]);

  const amenitiesList = Array.from(new Set(accommodations.flatMap((a) => a.amenities)));

  return (
    <div>
      <div className="mt-2 sticky p-2 z-10 justify-center items-center flex flex-row text-gray-600">
        <div ref={sortRef} onClick={() => setSortOpen(!sortOpen)} className="flex flex-row cursor-pointer mx-5 z-20 relative">
          <FaSort className="mr-2" /> Sort
          {sortOpen && (
            <div className="rounded p-2 absolute top-full mt-2 right-0 flex-col bg-white shadow-md z-20">
              <p className="cursor-pointer flex justify-between" onClick={() => handleSort("price")}>
                Price {sortOptions.sortBy === "price" && (sortOptions.sortOrder === "asc" ? "▲" : "▼")}
              </p>
              <p className="cursor-pointer flex justify-between" onClick={() => handleSort("rating")}>
                Rating {sortOptions.sortBy === "rating" && (sortOptions.sortOrder === "asc" ? "▲" : "▼")}
              </p>
              <p className="cursor-pointer flex justify-between" onClick={() => handleSort("popularity")}>
                Popularity {sortOptions.sortBy === "popularity" && (sortOptions.sortOrder === "asc" ? "▲" : "▼")}
              </p>
            </div>
          )}
        </div>
        <div ref={filterRef} className="cursor-pointer mx-5 relative z-50">
          <span className="flex flex-row" onClick={() => setFilterOpen(!filterOpen)}><FaFilter className="mr-2" /> Filter</span>
          {filterOpen && (
            <div className="rounded p-2 absolute top-full mt-2 left-0 flex-col bg-white shadow-md">
              <div className="flex flex-col mb-2">
                <p className="font-bold">Amenities:</p>
                {amenitiesList.map((amenity, index) => (
                  <label key={index} className="flex items-center">
                    <input type="checkbox" onChange={() => handleFilter("amenities", amenity)} />
                    <span className="ml-2">{amenity}</span>
                  </label>
                ))}
              </div>
              <div className="flex flex-col mb-2">
                <p className="font-bold">Type:</p>
                <select className="p-1 border rounded" onChange={(e) => handleFilter("type", e.target.value)}>
                  <option value="">All</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Room">Room</option>
                </select>
              </div>
              <div className="flex flex-col mb-2">
                <p className="font-bold">Price:</p>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={filters.price[1]}
                  onChange={(e) => handleFilter("price", [0, parseInt(e.target.value)])}
                />
                <span>${filters.price[1]}</span>
              </div>
              <div className="flex flex-col">
                <p className="font-bold">Rating:</p>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.rating}
                  onChange={(e) => handleFilter("rating", parseFloat(e.target.value))}
                />
                <span>{filters.rating} Stars</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {filteredData.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-4 mt-6 z-1">
          {filteredData.map((accommodation) => (
            <AccomodationCard key={accommodation.id} data={accommodation} />
          ))}
        </div>
      ) : (
        <div className="text-xl flex justify-center">Sorry, no matches found :/</div>
      )}
    </div>
  );
};

export default ViewList;
