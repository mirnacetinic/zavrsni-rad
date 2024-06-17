'use client';
import { useEffect, useState, useRef, useCallback } from "react";
import { FaSort, FaFilter, FaSortDown, FaSortUp } from "react-icons/fa";
import AccomodationCard from "./accomodationcard";
import { SearchAccommodation } from "@/app/types/type";

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
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-center items-center text-gray-600 mb-4 space-x-8">
        <div ref={sortRef} className="relative">
          <button onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring"
          >
            <FaSort className="mr-2" /> Sort
          </button>
          {sortOpen && (
            <div className="absolute top-full mt-2 right-0 w-40 bg-white rounded shadow-lg z-20">
              {(["price", "rating", "popularity"] as Array<"price" | "rating" | "popularity">).map((sortOption) => (
                <p key={sortOption} onClick={() => handleSort(sortOption)}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex" 
                >
                  {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}{" "}
                  {sortOptions.sortBy === sortOption && (sortOptions.sortOrder === "asc" ? <FaSortUp/> : <FaSortDown/>)}
                </p>
              ))}
            </div>
          )}
        </div>
        <div ref={filterRef} className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring"
          >
            <FaFilter className="mr-2" /> Filter
          </button>
          {filterOpen && (
            <div className="absolute top-full mt-2 left-0 w-64 bg-white rounded shadow-lg p-4 z-20 space-y-4">
              <div className="space-y-2">
                <p className="font-bold">Amenities:</p>
                {amenitiesList.map((amenity, index) => (
                  <label key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.amenities.includes(amenity)}
                      onChange={() => handleFilter("amenities", amenity)}
                      className="mr-2"
                    />
                    {amenity}
                  </label>
                ))}
              </div>
              <div className="space-y-2">
                <p className="font-bold">Type:</p>
                <select
                  className="w-full p-2 border rounded"
                  value={filters.type}
                  onChange={(e) => handleFilter("type", e.target.value)}
                >
                  <option value="">All</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Room">Room</option>
                </select>
              </div>
              <div className="space-y-2">
                <p className="font-bold">Price:</p>
                <input
                  className="w-full"
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={filters.price[1]}
                  onChange={(e) => handleFilter("price", [0, parseInt(e.target.value)])}
                />
                <span>€{filters.price[1]}</span>
              </div>
              <div className="space-y-2">
                <p className="font-bold">Rating:</p>
                <div className="flex items-center space-x-2">
                  <button
                    className="px-2 py-1 border rounded"
                    onClick={() => handleFilter("rating", Math.max(filters.rating - 0.5, 0))}
                  >
                    -
                  </button>
                  <input
                    className="w-full p-2 border rounded text-center"
                    type="number"
                    min="0"
                    max="5"
                    step="0.5"
                    value={filters.rating}
                    readOnly
                  />
                  <button
                    className="px-2 py-1 border rounded"
                    onClick={() => handleFilter("rating", Math.min(filters.rating + 0.5, 5))}
                  >
                    +
                  </button>
                </div>
                <span>{filters.rating.toString()} Stars</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredData.map((accommodation) => (
            <AccomodationCard key={accommodation.id} data={accommodation} />
          ))}
        </div>
      ) : (
        <div className="text-xl flex justify-center items-center mt-10">
          Sorry, no matches found :/
        </div>
      )}
    </div>
  );
};

export default ViewList;
