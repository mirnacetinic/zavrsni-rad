"use client";
import { Location } from "@prisma/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ModalBase from "../cards/modalbase";
import { useState, useEffect } from "react";
import { SafeUser } from "@/app/types/type";
import CustomCalendar from "./customcalendar";

interface FormProps {
  type: string;
  initialData?: any; 
  users? : SafeUser[];
  locations? : Location[];
}

const Form = ({ type, initialData , locations, users}: FormProps) => {
  const formFields: { label: string; type: string; name: string }[] = [];
  const customFields: JSX.Element[] = [];
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(initialData || {});
  const router = useRouter();
  let route = `/api/${type}`;

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
  }}, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(route, {
        method: initialData ? "PUT" : "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success(`Successfully ${initialData ? "updated" : "created"} ${type}`);
        router.refresh();
        setIsOpen(false);
      } else {
        toast.error(response.headers.get("message") || `Error ${initialData ? "updating" : "creating"} ${type}`);
      }
    } catch (error: any) {
      toast.error(`Error ${initialData ? "updating" : "creating"} ${type}. ${error.message}`);
    }
  };

  switch (type) {
    case "user":
      route = "/api/register";
      formFields.push(
        { label: "Name", type: "text", name: "name" },
        { label: "Surname", type: "text", name: "surname" },
        { label: "Email", type: "email", name: "email" },
        { label: "Password", type: "password", name: "password" }
      );

      customFields.push(
        <div className="mb-4 w-full" key="role">
          <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
          <select className="form-input" name="role" value={formData.role || ''} onChange={handleInputChange}>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
            <option value="HOST">Host</option>
          </select>
        </div>
      );
      customFields.push(
        <div className="mb-4 w-full" key="status">
          <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
          <select className="form-input" name="status" value={formData.status || ''} onChange={handleInputChange}>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      );
      break;

    case "accommodation":
      formFields.push(
        { label: "Title", type: "text", name: "title" },
        { label: "Description", type: "text", name: "description" },
        { label: "Address", type: "text", name: "address" }
      );

      customFields.push(
        <div className="mb-4 w-full" key="type">
          <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
          <select className="form-input" name="type" value={formData.type || ''} onChange={handleInputChange}>
            <option value="Villa">Villa</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Room">Room</option>
          </select>
        </div>
      );

      customFields.push(
        <div className="mb-4 w-full" key="status">
          <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
          <select className="form-input" name="status" value={formData.status || ''} onChange={handleInputChange}>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      );

      customFields.push(
        <div className="mb-4 w-full" key="locationId">
          <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
          <select
            className="form-input"
            name="locationId"
            value={formData.locationId || ''}
            onChange={handleInputChange}
            required>
            <option value="">Select Location</option>
            {locations?.map((location, index) => (
              <option key={index} value={location.id}>
                {location.city}, {location.country}
              </option>
            ))}
          </select>
        </div>
      );

      customFields.push(
        <div className="mb-2 w-full" key="ownerId">
          <label className="block text-gray-700 text-sm font-bold mb-2">Owner</label>
          <select
            className="form-input"
            name="ownerId"
            value={formData.ownerId || ''}
            onChange={handleInputChange}
            required>
            <option value="">Select Owner</option>
            {users?.map((user, index) => (
              <option key={index} value={user.id}>
                {user.name} {user.surname}
              </option>
            ))}
          </select>
        </div>
      );
      break;

    case "location":
      formFields.push(
        { label: "Country", type: "text", name: "country" },
        { label: "City", type: "text", name: "city" },
        { label: "ZIP", type: "text", name: "zip" }
      );
      break;

    case "amenity":
      formFields.push({ label: "Name", type: "text", name: "name" });
      break;

    case "unit":
      formFields.push(
        { label: "Title", type: "text", name: "title" },
        { label: "Description", type: "text", name: "description" }
      );

      customFields.push(
        <div className="mb-4 w-full" key="type">
          <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
          <select className="form-input" name="type" value={formData.type || ''} onChange={handleInputChange}>
            <option value="Villa">Villa</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Room">Room</option>
          </select>
        </div>
      );
      break;

    case "reservation":
      customFields.push(
        <div className="mb-2 w-full" key="user">
          <label className="block text-gray-700 text-sm font-bold mb-2">Made by</label>
          <select
            className="form-input"
            name="guestId"
            value={formData.guestId || ''}
            onChange={handleInputChange}
            required>
            <option value="">Select Guest</option>
            {users?.map((user, index) => (
              <option key={index} value={user.id}>
                {user.name} {user.surname}
              </option>
            ))}
          </select>
        </div>
      );

      customFields.push(
        <div>
        <label htmlFor="checkIn" className="block mb-2">Check in:</label>
            <input
              id="checkIn"
              type="text"
              placeholder="Select date"
              value={formData.checkIn || ''}
              onChange={handleInputChange}
              className="form-input"
            />
            <CustomCalendar
              selected={formData.checkIn}
              onSelect={(date) =>formData.checkIn = date}
              hidden={false}
             
            /></div>
      )
      customFields.push(
        <div>
        <label htmlFor="checkOut" className="block mb-2">Check Out:</label>
            <input
              id="checkOut"
              type="text"
              placeholder="Select date"
              value={formData.checkOut || ''}
              onChange={handleInputChange}
              className="form-input"
            />
            <CustomCalendar
              selected={formData.checkOut}
              onSelect={(date) =>formData.checkOut = date}
              hidden={false}
             
            /></div>
      )
      break;

    default:
      return null;
  }

  return (
    <div className="flex mt-2 mb-2">
      <div>
        <button onClick={() => { setIsOpen(true) }} className="form_button">
          {initialData ? 'Edit' : `Add ${type}`}
        </button>
      </div>
      <ModalBase isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form className="w-full flex flex-col items-center" onSubmit={handleSubmit}>
          {formFields.map((field, index) => (
            <div key={index} className="mb-2 w-full">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {field.label}
              </label>
              <input
                className="form-input"
                type={field.type}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleInputChange}
                required
              />
            </div>
          ))}

          {customFields.map((field) => field)}

          <button type="submit" className="form_button">
            Submit
          </button>
        </form>
      </ModalBase>
    </div>
  );
};

export default Form;
