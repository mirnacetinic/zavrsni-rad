"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AiOutlineSearch } from "react-icons/ai";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import Form from "../inputs/form";
import { SafeUser } from "@/app/types/type";
import { Location } from "@prisma/client";

interface InfoCardProps<T> {
  data: T[];
  type: string;
  users? : SafeUser[];
  locations? : Location[];
}

const InfoCard = <T extends { id: number }>({
  data,
  type,
  users,
  locations
}: InfoCardProps<T>) => {
  const router = useRouter();
  const [filteredData, setFilteredData] = useState(data);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: "asc" | "desc";
  } | null>(null);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const sortData = (key: keyof T) => {
    const direction =
      sortConfig?.key === key && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    const sortedData = [...filteredData].sort((a, b) => {
      const aVal = String(a[key]).toLowerCase();
      const bVal = String(b[key]).toLowerCase();

      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredData(sortedData);
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof T
  ) => {
    const { value } = e.target;
    const filtered = data.filter((item) =>
      String(item[key]).toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const deleteInstance = async (id: number) => {
    const route = type === "user" ? "/api/register" : `/api/${type}`;
    try {
      const response = await fetch(route, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        toast.success(`Deleted ${type} successfully`);
        router.refresh();
      } else {
        toast.error(
          response.headers.get("message") || "Error deleting instance"
        );
      }
    } catch (error: any) {
      toast.error(`Error deleting ${type}`, error.message);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="min-w-full overflow-visible">
        <div>
          <table className="border min-w-full text-left text-sm font-light text-surface">
            <thead className="bg-purple-700 border-b border-neutral-200 font-medium">
              <tr className="mx-1 border-b border-neutral-200">
                {Object.keys(data[0]).map((key) => (
                  <th key={key} className="p-2">
                    <div
                      onClick={() => sortData(key as keyof T)}
                      className="cursor-pointer flex flex-row text-center text-white font-light"
                    >
                      {sortConfig?.key === key ? (
                        <>
                          {sortConfig.direction === "asc" ? (
                            <FaSortUp className="mr-1" />
                          ) : (
                            <FaSortDown className="mr-1" />
                          )}
                        </>
                      ) : (
                        <FaSort className="mr-1" />
                      )}
                      {key.toUpperCase()} <AiOutlineSearch className="mx-1" />
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
              {filteredData.map((item) => (
                <tr key={item.id} className="bg-white cursor-pointer">
                  {Object.values(item).map((value, index) => (
                    <td key={index} className="p-2">
                      {value}
                    </td>
                  ))}
                  <td className="flex flex-row justify-center p-2">
                    <Form type={type} initialData={item} users={users} locations={locations}/>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteInstance(item.id);
                      }}
                      className="form_button">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
