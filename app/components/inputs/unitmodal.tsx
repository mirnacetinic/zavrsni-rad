import { UploadDropzone } from "@/app/utils/uploadthing";
import { Amenity} from "@prisma/client";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { AiOutlineClose } from "react-icons/ai";

interface ModalProps {
  isOpen: boolean;
  onAddUnit : (data:FieldValues)  => void;
  onClose : () => void;
}

enum Steps {
  INFO,
  AMENITY,
  IMAGES,
  FINISH,
}

const UnitModal = ({ isOpen,onClose, onAddUnit}: ModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      type: '',
      amenities: [],
      capacity: '',
      description: '',
      title: ''
    }
  });


  const [step, setStep] = useState(Steps.INFO);
  const [amenities, setAmenities] = useState<Amenity[]>([]);


  useEffect(() => {
    fetch('/api/amenity')
      .then((res) => res.json())
      .then((data) => {
        setAmenities(data.amenities);
      })
      .catch((error) => {
        console.error('Error fetching amenities:', error);
      });
  }, []);



  const back = () => {
    if (step > Steps.INFO) {
      setStep((value) => value - 1);
    }
  };

  const next = async () => {
    const isValid = await trigger();
    if (isValid && step < Steps.FINISH) {
      setStep((value) => value + 1);
    }
  };

  const handleSubmitUnit = (data: FieldValues) => {
    onAddUnit(data); 
    reset();
    setStep(Steps.INFO);
  };

  return (
    <div>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-70 z-50 animate-fadeIn"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 animate-slideInDown">
            <div className="p-8 border w-96 shadow-lg rounded-md bg-white relative">
                <div className="absolute text-black top-2 right-2 cursor-pointer" onClick={onClose}>
                <AiOutlineClose />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">{Steps[step]}</h3>
              </div>
              {step === Steps.AMENITY && (
                <div className="text-black">
                  <p>What amenities does your unit have?</p>
                  <ul className="m-6 grid grid-cols-2 gap-2">
                    {amenities.map((amenity) => (
                      <li key={amenity.id} className="flex items-center">
                        <label htmlFor={amenity.name}>
                          <input id={amenity.name} type="checkbox" value={amenity.id} {...register("amenities")} />
                          {amenity.name}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {step === Steps.INFO && (
                <div className="text-black">
                  <select id="type" {...register("type", { required: "Select type"})} className="form-input">
                    <option value="" hidden>What kind of unit?</option>
                    <option value="House">House</option>
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Room">Room</option>
                  </select>
                    <p className="text-red-500">{errors?.type?.message}</p>
                  <input {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 2,
                      message: "Title must be at least 2 characters",
                    }})}
                    type="text" name="title" placeholder="Title" className="form-input" />
                    <p className="text-red-500">{errors?.title?.message}</p>
                  <input {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 2,
                      message: "Description must be at least 2 characters",
                    }})}
                    type="text" name="description" placeholder="Description" className="form-input" />
                  {errors?.description && (
                    <p className="text-red-500">{errors?.description.message}</p>
                  )}
                  <input {...register("capacity", {
                    required: "Capacity is required",
                    min:{
                        value:1,
                        message:"Capacity minimum is 1!"
                    }})}
                    type="number" name="capacity" placeholder="Capacity" className="form-input" />
                    <p className="text-red-500">{errors?.capacity?.message}</p>
                </div>
              )}
              {step === Steps.IMAGES && (
                <UploadDropzone endpoint="imageUploader"
                onClientUploadComplete={(res) => {

                  console.log("Files: ", res);
                  alert("Upload Completed");
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
              />
              )}
              <button onClick={back} className={`form_button ${step === Steps.INFO ? "hidden" : ""}`}>
                Back
              </button>
              <button onClick={next} className={`form_button ${step === Steps.FINISH ? "hidden" : ""}`}>
                Next
              </button>
              {step === Steps.FINISH && (
                <button onClick={handleSubmit(handleSubmitUnit)}
                  className="form_button">
                  Confirm
                </button>)}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UnitModal;
