'use client';
import { useState } from "react";
import toast from "react-hot-toast";
import { MdDelete, MdOutlineModeEdit } from "react-icons/md";

interface PriceListProps {
  priceList: { from: Date; to: Date; price: number }[];
  setPriceList: React.Dispatch<React.SetStateAction<{ id?: number; from: Date; to: Date; price: number }[]>>;
}

const PriceListForm = ({ priceList, setPriceList }: PriceListProps) => {
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);
  const [price, setPrice] = useState(0);
  const [showForm, setShowForm] = useState(false);

  
  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
    return adjustedDate.toISOString().split("T")[0];
  };

  const handleAddPrice = () => {
    if (!from || !to || price <= 0) {
      toast.error("Please fill all fields correctly.");
      return;
    }

    const newFrom = new Date(from);
    const newTo = new Date(to);

    newFrom.setHours(0, 0, 0, 0);
    newTo.setHours(0, 0, 0, 0);

    if (newFrom > newTo) {
      toast.error("Date 'To' must be greater than date 'From'!");
      return;
    }

    for (const item of priceList) {
      if (
        (newFrom >= item.from && newFrom <= item.to) ||
        (newTo >= item.from && newTo <= item.to) ||
        (newFrom <= item.from && newTo >= item.to)
      ) {
        toast.error("Date range overlaps with an existing entry.");
        return;
      }
    }

    const newPrice = { from: newFrom, to: newTo, price };
    setPriceList((prevPriceList) =>
      [...prevPriceList, newPrice].sort((a, b) => a.from.getTime() - b.from.getTime())
    );

    setFrom(null);
    setTo(null);
    setPrice(0);
    setShowForm(false);
  };

  const handleDeletePrice = (index: number) => {
    setPriceList((prevPriceList) => prevPriceList.filter((_, idx) => idx !== index));
  };

  const handleEditPrice = (index: number) => {
    const priceItem = priceList[index];
    if (!priceItem) return;

    setFrom(priceItem.from);
    setTo(priceItem.to);
    setPrice(priceItem.price);
    setShowForm(true);

    setPriceList((prevPriceList) => prevPriceList.filter((_, idx) => idx !== index));
  };

  return (
    <div className="mt-2">
      <div className="flex flex-col">
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="form_button">
            Add New
          </button>
        )}
        {showForm && (
          <div className="flex flex-col">
            <label>From</label>
            <input
              type="date"
              className="form-input"
              value={formatDate(from)}
              onChange={(e) => setFrom(new Date(e.target.value))}
            />
            <label>To</label>
            <input
              type="date"
              required
              className="form-input"
              value={formatDate(to)}
              onChange={(e) => setTo(new Date(e.target.value))}
            />
            <label>Rate</label>
            <input
              type="number"
              min={0}
              required
              className="form-input"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            <button type="button" onClick={handleAddPrice} className="mt-2 form_button">
              Save
            </button>
          </div>
        )}
      </div>

      {priceList.length > 0 && !showForm && (
        <div className="m-2 overflow-auto max-h-48">
          <h4>Price List</h4>
          <ul>
            {priceList.map((priceItem, index) => (
              <li key={index} className="flex justify-between items-center border-b py-2">
                <div>
                  {priceItem.from.toDateString()} - {priceItem.to.toDateString()} : €{priceItem.price}
                </div>
                <div className="flex items-center space-x-2">
                  <MdOutlineModeEdit className="m-2 cursor-pointer" onClick={() => handleEditPrice(index)} />
                  <MdDelete className="cursor-pointer" onClick={() => handleDeletePrice(index)} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PriceListForm;
