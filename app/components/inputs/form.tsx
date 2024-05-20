"use client";
import { Location, User } from "@prisma/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ModalBase from "../cards/modalbase";
import { useState } from "react";

interface FormProps {
  type: string;
  locations?: Location[];
  users?: User[];
}

const Form = ({ type, locations, users }: FormProps) => {
  const formFields: { label: string; type: string; name: string }[] = [];
  const customFields: JSX.Element[] = [];
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  let route = `/api/${type}`;

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
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Role
          </label>
          <select
            className="form-input"
            name="role"
          >
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
            <option value="HOST">Host</option>
          </select>
        </div>
      );
      break;

    case "accommodation":
      formFields.push(
        { label: "Title", type: "text", name: "title" },
        { label: "Description", type: "text", name: "description" }
      );

      customFields.push(
        <div className="mb-4 w-full" key="type">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Type
          </label>
          <select
            className="form-input"
            name="type"
          >
            <option value="Villa">Villa</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Room">Room</option>
          </select>
        </div>
      );

      customFields.push(
        <div className="mb-2 w-full" key="location">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Location
          </label>
          <input
            className="form-input"
            type="text"
            name="location"
            list="locations-datalist"
            required
          />
          <datalist id="locations-datalist">
            {locations?.map((location, index) => (
              <option value={location.zip} key={index}>
                {location.city}, {location.country}
              </option>
            ))}
          </datalist>
        </div>
      );

      customFields.push(
        <div className="mb-2 w-full" key="user">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Owner
          </label>
          <input
            className="form-input"
            type="text"
            name="user"
            list="users-datalist"
            required
          />
          <datalist id="users-datalist">
            {users?.map((user, index) => (
              <option value={user.email} key={index}>
                {user.name} {user.surname}
              </option>
            ))}
          </datalist>
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

    default:
      return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      const response = await fetch(route, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Successfully created " + type);
        router.refresh();
        setIsOpen(false);
      } else {
        toast.error(
          response.headers.get("message") || "Error creating instance"
        );
      }
    } catch (error: any) {
      toast.error("Error creating " + type + ". " + error.message);
    }
  };

  return (
    <div className="flex mt-2 mb-2">
      <div>
        <button
          onClick={() => setIsOpen(true)}
          className="form_button"
        >
          Add {type}
        </button>
      </div>
      <ModalBase isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form
          className="w-full flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          {formFields.map((field, index) => (
            <div key={index} className="mb-2 w-full">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {field.label}
              </label>
              <input
                className="form-input"
                type={field.type}
                name={field.name}
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
