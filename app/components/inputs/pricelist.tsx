import { useState } from "react";
import toast from "react-hot-toast";

interface PriceListProps {
  priceList: { from: Date; to: Date; price: number }[];
  setPriceList: React.Dispatch<React.SetStateAction<{ id?: number; from: Date; to: Date; price: number }[]>>;
}

const PriceListForm = ({ priceList, setPriceList }: PriceListProps) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [price, setPrice] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const handleAddPrice = () => {
    if (!from || !to || price <= 0) {
      toast.error("Please fill all fields correctly.");
      return;
    }

    const newFrom = new Date(from);
    const newTo = new Date(to);

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

    setFrom("");
    setTo("");
    setPrice(0);
    setShowForm(false);
  };

  const handleDeletePrice = (index: number) => {
    setPriceList((prevPriceList) => prevPriceList.filter((_, idx) => idx !== index));
  };

  const handleEditPrice = (index: number) => {
    const priceItem = priceList[index];
    if (!priceItem) return;

    setFrom(priceItem.from.toISOString().split("T")[0]);
    setTo(priceItem.to.toISOString().split("T")[0]);
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
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <label>To</label>
            <input
              type="date"
              required
              className="form-input"
              value={to}
              onChange={(e) => setTo(e.target.value)}
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
            <button type="button" onClick={handleAddPrice} className="form_button">
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
                  <button
                    onClick={() => handleEditPrice(index)}
                    className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePrice(index)}
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
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
