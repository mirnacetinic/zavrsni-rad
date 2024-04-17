import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

export interface FormField {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
}

interface FormProps {
  formFields: FormField[];
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const Form: React.FC<FormProps> = ({ formFields, onSubmit, onClose }) => {
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
    <form onSubmit={handleSubmit}>
        <div className="absolute text-black top-2 right-2 cursor-pointer" onClick={onClose}>
          <AiOutlineClose />
        </div>
      {formFields.map((field, index) => (
        <div key={index} className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">{field.label}</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}/>
        </div>
      ))}
      <button
        type="submit"
        className="m-4 px-2 py-2 bg-purple-800 text-white rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-600">
        Submit
      </button>
    </form>
  );
};

export default Form;
