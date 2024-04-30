import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { Location, User } from '@prisma/client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface FormProps {
  type: string;
  locations?: Location[];
  users?: User[];
  onClose: () => void;
}

const Form: React.FC<FormProps> = ({ type, onClose, locations, users }) => {
  const formFields: { label: string; type: string; name: string }[] = [];
  const customFields: JSX.Element[] = [];
  const router = useRouter();
  let route:string ="";

  switch (type) {
    case 'Users':
      route = '/api/register';
      formFields.push(
        { label: 'Name', type: 'text', name: 'name' },
        { label: 'Surname', type: 'text', name: 'surname' },
        { label: 'Email', type: 'email', name: 'email' },
        { label: 'Password', type: 'password', name: 'password' }
      );

      customFields.push(
        <div className="mb-4 w-full" key="role">
          <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="role">
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
            <option value="HOST">Host</option>
          </select>
        </div>
      );
      break;

    case 'Accomodations':
      route='api/accomodation'
      formFields.push(
        { label: 'Title', type: 'text', name: 'title' },
        { label: 'Description', type: 'text', name: 'description' }
      );

      customFields.push(
        <div className="mb-4 w-full" key="type">
          <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="type">
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Room">Room</option>
          </select>
        </div>)

      customFields.push(
        <div className="mb-2 w-full" key="location">
          <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text" name="location" list="locations-datalist"/>
          <datalist id="locations-datalist">
            {locations?.map((location, index) => (
              <option value={location.zip} key={index}> {location.city}, {location.country} </option>
              ))}
          </datalist>
        </div>);

      customFields.push(
        <div className="mb-2 w-full" key="user">
          <label className="block text-gray-700 text-sm font-bold mb-2">Owner</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text" name="user" list="users-datalist"/>
          <datalist id="users-datalist">
            {users?.map((user, index) => (
              <option value={user.email} key={index}>{user.name} {user.surname}</option>
              ))}
          </datalist>
        </div>
      );
      break;

    case 'Locations':
      route='api/location';
      formFields.push(
        { label: 'Country', type: 'text', name: 'country' },
        { label: 'City', type: 'text', name: 'city' },
        { label: 'ZIP', type: 'text', name: 'zip' }
      );
      break;

    default:
      break;
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(type+" instance created");
        router.refresh();

    } else {
        toast.error(response.headers.get("message"));
    }
      
    } catch (error : any) {
      toast.error('Error creating instance of :'+ type, error.message);
    }

  };

  return (
    <div className="flex mt-2 mb-2">
       <form className="w-80 flex flex-col items-center" onSubmit={handleSubmit}>
        <div className="relative text-black top-2 left-40 cursor-pointer" onClick={onClose}>
          <AiOutlineClose />
        </div>

        {formFields.map((field, index) => (
          <div key={index} className="mb-2 w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2">{field.label}</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type={field.type} name={field.name} required/>
          </div>
        ))}

        {customFields.map((field) => field)}

        <div className="mb-2 w-full"/>

        <button type="submit"
          className="mb-2 px-2 py-2 bg-purple-800 text-white rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-600">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
