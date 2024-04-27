import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface FormProps {
  type : string,
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const Form: React.FC<FormProps> = ({ type, onSubmit, onClose }) => {
  var formFields: { label: string; type: string; name: string }[] = [];

  switch (type) {
    case 'Users':
      formFields = [
        { label: 'Name', type: 'text', name: 'name' },
        { label: 'Surname', type: 'text', name: 'surname' },
        { label: 'Username', type: 'text', name: 'username' },
        { label: 'Email', type: 'email', name: 'email' },
        { label: 'Password', type: 'password', name: 'password' },
      ];
      break;
    case 'Objects':
      formFields = [
        { label: 'Title', type: 'text', name: 'productName' },
        { label: 'Description', type: 'text', name: 'description' },
      ];
      break;
      case 'Locations':
      formFields = [
        { label: 'Country', type: 'text', name: 'country' },
        { label: 'City', type: 'text', name: 'city' },
        { label: 'ZIP', type: 'text', name: 'ZIP' },
      ];
      break;
    default:
      break;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    onSubmit(data);
  };

  return (
    <form className="w-80" onSubmit={handleSubmit}>
        <div className="absolute text-black top-2 right-2 cursor-pointer" onClick={onClose}>
          <AiOutlineClose />
        </div>
      {formFields.map((field, index) => (
        <div key={index} className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">{field.label}</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type={field.type}
            name={field.name}/>
        </div> 
      ))}
      <button
        type="submit"
        className="m-4 justify-center px-2 py-2 bg-purple-800 text-white rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-600">
        Submit
      </button>
    </form>
  );
};

export default Form;
