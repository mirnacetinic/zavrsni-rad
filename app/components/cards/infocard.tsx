"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaSort, FaSortDown, FaSortUp, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Form from "../inputs/form";
import { Amenity, Location } from "@prisma/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface InfoCardProps<T> {
  data: T[];
  type: string;
  users?: {id: number, name: string, surname: string}[];
  locations?: Location[];
  amenities? : Amenity[];
  units? :  {id: number, title: string, accommodation: string}[];
}

const InfoCard = <T extends { id: number; status?: string, past? : boolean }>({ data, type, users, locations, amenities, units }: InfoCardProps<T>) => {
  const router = useRouter();
  const [filteredData, setFilteredData] = useState(data);
  const [expandedCells, setExpandedCells] = useState<{ [key: number]: { [key: string]: boolean } }>({});
  const [slidableCells, setSlidableCells] = useState<{ [key: number]: { [key: string]: number | undefined } }>({});
  const [sortParameters, setSortParameters] = useState<{ key: keyof T; direction: "asc" | "desc" } | null>(null);
  const [filters, setFilters] = useState<{ key: keyof T; value: string }[]>([]);
  const [rating, setRating] = useState<{ [key: number]: number }>({});

 useEffect(() => {
    applyFilters();
  }, [data, filters]);

  const applyFilters = () => {
    let filtered = [...data];
    filters.forEach(({ key, value }) => {
      filtered = filtered.filter((item) => filterItem(item, key, value));
    });
    setFilteredData(filtered);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof T) => {
    const { value } = e.target;
    setFilters((prev) => {
      if (value === "") {
        return prev.filter((filter) => filter.key !== key);
      } else {
        const existingFilter = prev.find((filter) => filter.key === key);
        if (existingFilter) {
          return prev.map((filter) => (filter.key === key ? { ...filter, value } : filter));
        } else {
          return [...prev, { key, value }];
        }
      }
    });
  };

  const toggleExpandCell = (rowId: number, cellKey: string) => {
    setExpandedCells((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [cellKey]: !prev[rowId]?.[cellKey],
      },
    }));
  };

  const toggleSlideCell = (rowId: number, cellKey: string) => {
    setSlidableCells((prev) => {
      const newRowState = { ...prev[rowId] };
      if (newRowState[cellKey] !== undefined) {
        delete newRowState[cellKey];
      } else {
        newRowState[cellKey] = 0;
      }
      return { ...prev, [rowId]: newRowState };
    });
  };

  const filterItem = (item: T, key: keyof T, value: string): boolean => {
    const itemValue = item[key];
    if (typeof itemValue === "object" && itemValue !== null) {
      if (Array.isArray(itemValue)) {
        return itemValue.some((arrayItem) =>
          arrayItem != null
            ? Object.values(arrayItem).some((subValue) => String(subValue).toLowerCase().includes(value.toLowerCase()))
            : value === "None"
        );
      } else {
        return Object.values(itemValue).some((objectValue) => String(objectValue).toLowerCase().includes(value.toLowerCase()));
      }
    }
    return String(itemValue).toLowerCase().includes(value.toLowerCase());
  };

  const deleteInstance = async (id: number, route?: string) => {
    const path = route || (type === "user" ? "/api/register" : `/api/${type}`);
    try {
      const response = await fetch(path, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        toast.success(response.headers.get("message") || `Deleted ${type} successfully`);
        router.refresh();
      } else {
        toast.error(response.headers.get("message") || "Error deleting instance");
      }
    } catch {
      toast.error(`Error deleting ${type}`);
    }
  };

  const updateInstance = async (id: number, status: string, route: string) => {
    try {
      const response = await fetch(route, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        toast.success(`${status} successfully`);
        router.refresh();
      } else {
        toast.error("Something went wrong");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const guestRating = async (id: number, rating: number) => {
    if(!rating || rating<1 || rating>5){
      toast.error("Input valid rating!");
      return;
    }
    try {
      const response = await fetch("/api/reservation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, guestReview: rating }),
      });

      if (response.ok) {
        toast.success("Rated successfully");
        router.refresh();
      } else {
        toast.error("Something went wrong");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const sortData = (key: keyof T) => {
    const direction = sortParameters?.key === key && sortParameters.direction === "asc" ? "desc" : "asc";
    const sorted = [...filteredData].sort((a, b) => {
      const valueA = String(a[key]).toLowerCase();
      const valueB = String(b[key]).toLowerCase();

      if (valueA < valueB) return direction === "asc" ? -1 : 1;
      if (valueA > valueB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredData(sorted);
    setSortParameters({ key, direction });
  };

  const handlePrevious = (rowId: number, cellKey: string) => {
    setSlidableCells((prev) => {
      const newRowState = { ...prev[rowId] };
      if (newRowState[cellKey] !== undefined) {
        newRowState[cellKey] = newRowState[cellKey]! > 0 ? newRowState[cellKey]! - 1 : newRowState[cellKey];
      }
      return { ...prev, [rowId]: newRowState };
    });
  };

  const handleNext = (rowId: number, cellKey: string, length: number) => {
    setSlidableCells((prev) => {
      const newRowState = { ...prev[rowId] };
      if (newRowState[cellKey] !== undefined) {
        newRowState[cellKey] = newRowState[cellKey]! < length - 1 ? newRowState[cellKey]! + 1 : newRowState[cellKey];
      }
      return { ...prev, [rowId]: newRowState };
    });
  };

  return (
    <div className="flex flex-col">
      <div className="min-w-full overflow-visible">
        <div>
          <table className="border min-w-full text-left text-sm font-light text-surface">
            <thead className="bg-purple-700 border-b border-neutral-200 font-medium">
              <tr className="mx-1 border-b border-neutral-200">
                {data.length > 0 &&
                  Object.keys(data[0])
                    .filter((key) => !key.toLowerCase().includes("id") && key!=="past")
                    .map((key) => (
                      <th key={key} className="p-2">
                        <div onClick={() => sortData(key as keyof T)} className="cursor-pointer flex flex-row text-center text-white font-light">
                          {sortParameters?.key === key ? (
                            sortParameters.direction === "asc" ? (
                              <FaSortUp className="mr-1" />
                            ) : (
                              <FaSortDown className="mr-1" />
                            )
                          ) : (
                            <FaSort className="mr-1" />
                          )}
                          {key.toUpperCase()}
                          <AiOutlineSearch className="mx-1" />
                        </div>
                        <input
                          type="text"
                          onChange={(e) => handleFilterChange(e, key as keyof T)}
                          className="cursor-pointer m-1 block w-full p-1 pr-8 border border-gray-300 rounded-md text-sm"
                          placeholder="Filter"
                        />
                      </th>
                    ))}
                <th className="p-2"></th>
              </tr>
            </thead>

            <tbody className="text-center">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={Object.keys(data[0]).length + 1} className="text-center py-4">
                    No data found
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr className="bg-white cursor-pointer">
                      {Object.entries(item)
                        .filter(([key]) => !key.toLowerCase().includes("id") && key!=="past")
                        .map(([key, value]) => (
                          <td key={key} className="p-2">
                            {typeof value === "object" && !Array.isArray(value) ? (
                              <div>
                                <span className="text-2xl font-semibold" onClick={(e) => { e.stopPropagation(); toggleExpandCell(item.id, key); }}>
                                  {expandedCells[item.id]?.[key] ? "-" : "+"}
                                </span>
                                {expandedCells[item.id]?.[key] && (
                                  <div className="flex flex-col mt-2 p-4 border rounded">
                                    {Object.entries(value).map(([objectKey, objectValue]) => (
                                      <div className="flex flex-col" key={objectKey}>
                                        <p>
                                          <strong>{objectKey.toUpperCase()}: </strong>
                                          {String(objectValue)}
                                        </p>
                                        {objectKey === "status" && (type === "reservation" ? (
                                          <button onClick={() => deleteInstance(item.id, "/api/review")} className="form_button">
                                            Remove
                                          </button>
                                        ) : (
                                          type === "host" && objectValue === "None" && (
                                            <button onClick={() => updateInstance(item.id, "Reported", "/api/review")} className="form_button">
                                              Report
                                            </button>
                                          )
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : Array.isArray(value) ? (
                              <div>
                                <span className="text-2xl font-semibold" onClick={(e) => { e.stopPropagation(); toggleSlideCell(item.id, key); }}>
                                  {slidableCells[item.id]?.[key] !== undefined ? "-" : "+"}
                                </span>
                                {slidableCells[item.id]?.[key] !== undefined && (
                                  <div className="flex flex-col mt-2 p-4 border rounded">
                                    <div className="flex flex-row items-center justify-between">
                                      <FaChevronLeft
                                        className={`cursor-pointer ${slidableCells[item.id][key] === 0 ? "text-gray-300" : "text-black"}`}
                                        onClick={(e) => { e.stopPropagation(); handlePrevious(item.id, key); }}
                                      />
                                      <div className="flex flex-col mx-4">
                                        {Object.entries(value[slidableCells[item.id][key] || 0]).map(([subKey, subValue]) => (
                                          <div key={subKey} className="flex flex-col">
                                            <p>
                                              <strong>{subKey.toUpperCase()}: </strong>
                                              {String(subValue)}
                                            </p>
                                            {subKey === "reservationId" && type === "user" && (
                                              <button onClick={() => deleteInstance(subValue as number, "/api/review")} className="form_button">
                                                Remove
                                              </button>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                      <FaChevronRight
                                        onClick={(e) => { e.stopPropagation(); handleNext(item.id, key, value.length); }}
                                        className={`cursor-pointer ${slidableCells[item.id][key] === value.length - 1 ? "text-gray-300" : "text-black"}`}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : key === "guestRating" && value === "None" && item.status === "Active"  && item.past? (
                              <div className="flex flex-col items-center border border-gray p-1 rounded">
                                <input
                                  placeholder="Rate guest"
                                  type="number"
                                  min="1"
                                  max="5"
                                  onChange={(e) => setRating((prev) => ({ ...prev, [item.id]: +e.target.value }))}
                                  className="p-1 w-full"
                                />
                                <button onClick={() => guestRating(item.id, rating[item.id])} className="form_button">
                                  Rate
                                </button>
                              </div>
                            ) : (
                              value
                            )}
                          </td>
                        ))}
                      {type === "host" && item.status === "Inquiry" && item.past===false ? (
                        <td className="flex flex-row justify-center p-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateInstance(item.id, "Accepted", "/api/reservation");
                            }}
                            className="form_button"
                          >
                            Accept
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateInstance(item.id, "Declined", "/api/reservation");
                            }}
                            className="form_button">
                            Decline
                          </button>
                        </td>
                      ) : (
                        <td className="text-center p-1">
                          {type === "review" ? (
                            <>
                            <button onClick={(e) => { e.stopPropagation(); updateInstance(item.id, "Declined", "/api/review"); }} className="form_button">
                              Decline
                            </button>
                              <button onClick={(e) => { e.stopPropagation(); deleteInstance(item.id); }} className="form_button">
                              Delete
                            </button>
                            </>
                          ) : (
                            <div className="flex flex-row justify-center items-center">
                            <Form type={type} initialData={item} users={users} locations={locations} amenities={amenities} units={units} />
                            {type !== "host" && (
                              <button onClick={(e) => { e.stopPropagation(); deleteInstance(item.id); }} className="form_button">
                                Delete
                              </button>
                            )}
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
