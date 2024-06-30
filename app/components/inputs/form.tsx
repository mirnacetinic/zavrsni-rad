"use client";
import { Amenity, Location } from "@prisma/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ModalBase from "../cards/modalbase";
import { countries, status, accommodationType} from "@/app/types/type";

interface FormProps {
  type: string;
  initialData?: any;
  users?: {id: number, name: string, surname: string}[];
  locations?: Location[];
  amenities? : Amenity[];
  units? :  {id: number, title: string, accommodation: string}[];
}

const Form = ({ type, initialData, locations, users, amenities, units }: FormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const formFields: { label: string; type: string; name: string }[] = [];
  let customFields: { label: string; type: string; name: string; options?: { value: string; label: string }[] }[] = [];
  const router = useRouter();

  let route = `/api/${type}`;

  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
      if(initialData.passId){
        setFormData((prevData) => ({ ...prevData, password: initialData.passId }));
      }
      if (initialData.amenities && initialData.amenities !== "None") {
        const amenityIds = initialData.amenities.map((amenity: Amenity) => amenity.id);
        setFormData((prevData) => ({ ...prevData, amenities: amenityIds }));
      }
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      const checked = e.target.checked;
      setFormData((prevData) => {
        const selectedValues = new Set(prevData[name] || []);
        if (checked) {
          selectedValues.add(value);
        } else {
          selectedValues.delete(value);
        }
        return { ...prevData, [name]: Array.from(selectedValues) };
      });
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const allowedFields = [
        ...formFields.map((field) => field.name),
        ...customFields.map((field) => field.name),
      ];
      let filteredData = Object.keys(formData).filter((key) => allowedFields.includes(key)).reduce((obj, key) => {
          obj[key] = formData[key];
          return obj;
        }, {} as { [key: string]: any });

      if (initialData) {
        filteredData.id = initialData.id;
        if(filteredData.inquiry && filteredData.inquiry === "false") filteredData.inquiry = '';
      }

      const response = await fetch(route, {
        method: initialData ? "PUT" : "POST",
        body: JSON.stringify(filteredData),
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

      customFields = [
        { label: "Role", type: "select", name: "role", options: [
          { value: "ADMIN", label: "Admin" },
          { value: "USER", label: "User" },
          { value: "HOST", label: "Host" },
        ] },
        { label: "Status", type: "select", name: "status", options: [
          { value: "Active", label: "Active" },
          { value: "Suspended", label: "Suspended" },
          { value: "Inactive", label: "Inactive" },
        ] },
        { label: "Country", type: "select", name: "country", options: countries.map((country) => (
          { value: country, label: country }))}
      ];
      break;

    case "accommodation":
      formFields.push(
        { label: "Title", type: "text", name: "title" },
        { label: "Description", type: "text", name: "description" },
        { label: "Address", type: "text", name: "address" }
      );

      customFields = [
        { label: "Type", type: "select", name: "type", options: accommodationType.map((type)=>(
          { value: type, label: type }))
        },
        { label: "Status", type: "select", name: "status", options: [
          { value: "Active", label: "Active" },
          { value: "Suspended", label: "Suspended" },
          { value: "Inactive", label: "Inactive" },
        ] },
        { label: "Location", type: "select", name: "locationId", options: locations?.map((location) => (
            { value: location.id.toString(), label: `${location.city}, ${location.country}` })) || [] 
        },

        { label: "Owner", type: "select", name: "ownerId", options: users?.map((user) => (
            { value: user.id.toString(), label: `${user.name} ${user.surname}` })) || [] 
        }
      ];
      break;

    case "location":
      formFields.push(
        { label: "City", type: "text", name: "city" },
        { label: "ZIP", type: "text", name: "zip" }
      );
      customFields = [
        { label: "Country", type: "select", name: "country", options: countries.map((country) => (
          { value: country, label: country }))
        }
      ];
      break;

    case "amenity":
      formFields.push({ label: "Name", type: "text", name: "name" });
      break;

    case "unit":
      formFields.push(
        { label: "Accommodation", type: "number", name: "accommodationId" },
        { label: "Title", type: "text", name: "title" },
        { label: "Description", type: "text", name: "description" },
        { label: "Capacity", type: "number", name: "capacity" },
        { label: "Bedrooms", type: "number", name: "bedrooms" },
        { label: "Beds", type: "number", name: "beds" },
        { label: "Bathrooms", type: "number", name: "bathrooms" },

      );
      customFields = [
        { label: "Type", type: "select", name: "type", options: accommodationType.map((type)=>(
          { value: type, label: type }))
        },
        { label: "Inquiry", type: "radio", name: "inquiry", options: [
          { value: "true", label: "Yes" },
          { value: "false", label: "No" }
        ]},
        { label: "Amenities", type: "checkbox", name: "amenities", options: amenities?.map((a) => (
          { value: a.id.toString(), label: a.name })) || [] 
        }
      ];
      break;

    case "reservation":
      formFields.push(
        { label: "Check In", type: "string", name: "checkIn" },
        { label: "Check Out", type: "string", name: "checkOut" },
        { label: "Guests", type: "number", name: "guests" },
        { label: "Price", type: "number", name: "price" },
        { label: "Payment", type: "string", name: "paymentId" },
      );
      customFields = [
        { label: "Unit", type: "select", name: "unitId", options: units?.map((unit) => (
          { value: unit.id.toString(), label: `${unit.title} - ${unit.accommodation}` })) || []
        },
        { label: "Guest", type: "select", name: "userId", options: users?.map((user) => (
          { value: user.id.toString(), label: `${user.name} ${user.surname}` })) || []
        },
        { label: "Status", type: "select", name: "status", options: status.map((status) => (
          { value: status, label: status }))
        }

      ];
      break;

    default:
      return null;
  }

  if (!isOpen) {
    return (
      <div className="my-2">
        <button onClick={() => { setIsOpen(true) }} className="form_button">
          {initialData ? 'Edit' : `Add ${type}`}
        </button>
      </div>
    );
  }

  return (
    <ModalBase isOpen={isOpen} onClose={() => setIsOpen(false)} height="max-h-[90vh]" width="sd:w-[100vw] w-[30vw]">
      <div className="w-full flex flex-col items-center">
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

        {customFields.map((field, index) => (
          <div key={index} className="mb-2 w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {field.label}
            </label>
            {field.type === "select" ? (
              <select
                className="form-input"
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleInputChange}
                required
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((option, idx) => (
                  <option key={idx} value={option.value}>{option.label}</option>
                ))}
              </select>
            ) : field.type === "radio" ? (
              field.options?.map((option, idx) => (
                <div key={idx} className="flex items-center">
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={formData[field.name] === option.value}
                    onChange={handleInputChange}
                  />
                  <label className="ml-2">{option.label}</label>
                </div>
              ))
            ) : field.type === "checkbox" ? (
              field.options?.map((option, idx) => (
                <div key={idx} className="flex items-center">
                  <input
                    type="checkbox"
                    name={field.name}
                    value={option.value}
                    checked={Array.isArray(formData[field.name]) && formData[field.name].includes(option.value)}
                    onChange={handleInputChange}
                  />
                  <label className="ml-2">{option.label}</label>
                </div>
              ))
            ) : (
              <input
                className="form-input"
                type={field.type}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleInputChange}
                required
              />
            )}
          </div>
        ))}

        <button type="submit" className="form_button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </ModalBase>
  );
};

export default Form;
