import { useState } from "react";
import toast from "react-hot-toast";

interface PriceListProps {
  priceList: { from: Date; to: Date; price: number }[];
  setPriceList: React.Dispatch<React.SetStateAction<{ from: Date; to: Date; price: number }[]>>;
}

const PriceList = ({ priceList, setPriceList }: PriceListProps) => {
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

  return (
    <div>
      <h3>Prices:</h3>
      {!showForm && (
        <button onClick={() => setShowForm(true)} className="form_button">
          Add New
        </button>
      )}
      {showForm && (
        <div className="flex flex-col">
          <label>From:</label>
          <input
            type="date"
            className="form-input"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <label>To:</label>
          <input
            type="date"
            required
            className="form-input"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <label>Rate:</label>
          <input
            type="number"
            min={0}
            required
            className="form-input"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
          <button onClick={handleAddPrice} className="form_button">
            Add
          </button>
        </div>
      )}

      {priceList.length > 0 && (
        <div className="mt-4">
          <h4>Price List:</h4>
          <ul>
            {priceList.map((priceItem, index) => (
              <li key={index}>
                {priceItem.from.toDateString()} - {priceItem.to.toDateString()} : €{priceItem.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PriceList;
