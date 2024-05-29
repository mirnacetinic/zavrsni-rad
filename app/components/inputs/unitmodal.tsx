import { UploadButton } from "@/app/utils/uploadthing";
import { Amenity } from "@prisma/client";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { AiOutlineClose } from "react-icons/ai";
import PriceList from "./pricelist";
import toast from "react-hot-toast";

interface ModalProps {
  isOpen: boolean;
  onAddUnit: (data: FieldValues) => void;
  onClose: () => void;
}

enum Steps {
  INFO,
  AMENITY,
  IMAGES,
  PRICES,
  FINISH,
}

const UnitModal = ({ isOpen, onClose, onAddUnit }: ModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      type: "",
      amenities: [],
      capacity: "",
      description: "",
      title: "",
      images: [],
      priceLists: [],
    },
  });

  const [step, setStep] = useState(Steps.INFO);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [uploadedImages, setUploadedImages] = useState<{ url: string, key: string }[]>([]);
  const [priceList, setPriceList] = useState<{ from: Date; to: Date; price: number }[]>([]);

  useEffect(() => {
    fetch("/api/amenity")
      .then((res) => res.json())
      .then((data) => {
        setAmenities(data.amenities);
      })
      .catch((error) => {
        console.error("Error fetching amenities:", error);
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
      if(step==Steps.PRICES){
        if(priceList!){
          toast('If you do not set prices, your unit will be Inactive', {
            duration: 4000,
            position: 'top-center',
          
            icon: '!'});

        }
        else{
        toast('Please note that the dates you have not set rates from will not be bookable', {
          duration: 4000,
          position: 'top-center',
        
          icon: '!'});
      }}
      setStep((value) => value + 1);
    }
  };

  const handleDeleteImage = async (key: string) => {
    try {
      const response = await fetch('/api/image', {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      if (response.ok) {
        setUploadedImages((prevImages) => prevImages.filter(image => image.key !== key));
      } else {
        console.log(
          response.headers.get("message") || "Error deleting instance"
        );
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  const handleSubmitUnit = (data: FieldValues) => {
    data.images = uploadedImages.map(img => img.url);
    data.priceLists = priceList;
    onAddUnit(data);
    reset();
    setUploadedImages([]);
    setPriceList([]);
    setStep(Steps.INFO);
  };

  return (
    <div>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-70 z-50 animate-fadeIn">
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="px-6 py-2 border h-[80vh] w-96 shadow-lg rounded-md bg-white relative">
                <div className="absolute text-black top-2 right-2 cursor-pointer" onClick={onClose}>
                  <AiOutlineClose />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900">{Steps[step]}</h3>
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
                    <select id="type" {...register("type", { required: "Select type" })} className="form-input">
                      <option value="" hidden>
                        What kind of unit?
                      </option>
                      <option value="House">House</option>
                      <option value="Villa">Villa</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Room">Room</option>
                    </select>
                    <p className="error">{errors?.type?.message}</p>
                    <input
                      {...register("title", {
                        required: "Title is required",
                        minLength: {
                          value: 2,
                          message: "Title must be at least 2 characters",
                        },
                      })}
                      type="text"
                      name="title"
                      placeholder="Title"
                      className="form-input"
                    />
                    <p className="error">{errors?.title?.message}</p>
                    <textarea {...register("description", {
                      required: "Description is required",
                      minLength: {
                        value: 2,
                        message: "Description must be at least 2 characters",
                      },
                      maxLength: {
                        value: 200,
                        message: "Description is limited to 200 characters"
                      }
                    })}
                      name="description" placeholder="Description" className="form-input" />
                    {errors?.description && (
                      <p className="error">{errors?.description.message}</p>)}
                    <input
                      {...register("capacity", {
                        required: "Capacity is required",
                        min: {
                          value: 1,
                          message: "Capacity minimum is 1!",
                        },
                      })}
                      type="number"
                      name="capacity"
                      placeholder="Capacity"
                      className="form-input"
                    />
                    <p className="error">{errors?.capacity?.message}</p>
                  </div>
                )}
                {step === Steps.IMAGES && (
                  <div>
                    <UploadButton className={`${uploadedImages.length === 4 ? 'hidden' : ''}`}
                      appearance={{
                        button({ ready, isUploading }) {
                          return {
                            background: "#6b46c1",
                            ...(ready && { color: "#ecfdf5" }),
                            ...(isUploading && { color: 'lightgreen' }),
                          };
                        }
                      }}
                      endpoint="imageUnit"
                      onClientUploadComplete={(res) => {
                        const imageFiles = res.map((file) => ({ url: file.url, key: file.key }));
                        setUploadedImages((prev) => [...prev, ...imageFiles]);
                      }}
                      onUploadError={(error: Error) => {
                        alert(`ERROR! ${error.message}`);
                      }}
                    />
                    <div className="uploaded-images">
                      {uploadedImages?.map((image, index) => (
                        <div key={index} className="items-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(image.key)}
                            className="relative right-1 top-3 bg-red-500 text-white rounded-full py-1 px-2"
                          >
                            x
                          </button>
                          <div>
                            <img key={index} src={image.url} alt={`Uploaded ${index + 1}`} className="uploaded-image" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {step === Steps.PRICES && (
                  <div className="flex flex-col justify-center text-black items-center">
                    <p>Set your nightly rates</p>
                    <PriceList priceList={priceList} setPriceList={setPriceList} />
                  </div>
                )}
                <div className="absolute bottom-3 left-0 w-full flex justify-center">
                  <button onClick={back} className={`form_button ${step === Steps.INFO ? "hidden" : ""}`}>
                    Back
                  </button>
                  <button onClick={next} className={`form_button ${step === Steps.FINISH ? "hidden" : ""}`}>
                    Next
                  </button>
                  {step === Steps.FINISH && (
                    <button onClick={handleSubmit(handleSubmitUnit)} className="form_button">
                      Confirm
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UnitModal;
