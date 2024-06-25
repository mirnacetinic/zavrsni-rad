import { useForm, FieldValues } from "react-hook-form";
import { useEffect, useState } from "react";
import { Amenity } from "@prisma/client";
import toast from "react-hot-toast";
import { UploadButton } from "@/app/utils/uploadthing";
import PriceListForm from "./pricelist";
import ModalBase from "../cards/modalbase";

interface UnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUnit: (unitData: FieldValues) => void;
  unit?: FieldValues | null;
  amenities? : Amenity[];
}

enum Steps {
  INFO,
  ROOMS,
  AMENITY,
  IMAGES,
  PRICES,
  FINISH,
}

const UnitModal = ({ isOpen, onClose, onAddUnit, unit, amenities }: UnitModalProps) => {
  const { register, handleSubmit, reset, setValue, trigger, formState:{errors} } = useForm({
    defaultValues: unit || {
      capacity: "",
      amenities: [],
      inquiry : "",
      priceLists: [],
      type: "",
      title: "",
      description: "",
      bedrooms : "",
      bathrooms : "",
      beds : "",
      images: [],
      imagesKeys : [],
    },
  });
  
  const [step, setStep] = useState(Steps.INFO);
  const [amenitiesAll, setAmenities] = useState<Amenity[]>(amenities || []);
  const [uploadedImages, setuploadedImages] = useState<{ url: string, key: string }[]>([]);
  const [priceList, setPriceList] = useState<{ id?: number ,from: Date; to: Date; price: number }[]>([]);


  useEffect(() => {
    if (unit) {
      setValue("id", unit.id);
      setValue("type", unit.type);
      setValue("title", unit.title);
      setValue("description", unit.description);
      setValue("capacity", unit.capacity);
      setValue("bedrooms", unit.bedrooms);
      setValue("bathrooms", unit.bathrooms);
      setValue("beds", unit.beds);
      setValue("inquiry", unit.inquiry ? "true" : "");
      setValue("amenities", unit.amenities?.map((a:any)=>a.toString()) || []);
      setValue("priceLists", unit.priceLists);
      setPriceList(unit.priceLists || []);
      setuploadedImages(unit.images.map((url: string, index: number) => ({ url, key: unit?.imagesKeys[index] })));
  
    } else {
      setPriceList([]);
      setuploadedImages([]);
      reset({
        type: "",
        title: "",
        description: "",
        inquiry: "",
        capacity: "",
        beds : "",
        bathrooms :"",
        bedrooms :"",
        images: [],
        imagesKeys: [],
        amenities: [],
        priceLists: [],
      });
    }
  }, [unit, setValue, reset]);
  
  const onSubmit = (data: FieldValues) => {
    data.priceLists = priceList;
    data.images = uploadedImages.map(img => img.url);
    data.imagesKeys = uploadedImages.map(img=> img.key);
    onAddUnit(data);
    reset();
    setuploadedImages([])
    setPriceList([]);
    setStep(Steps.INFO);
  };


  useEffect(() => {
    if(amenitiesAll.length==0 && isOpen){
    fetch("/api/amenity")
      .then((res) => res.json())
      .then((data) => {
        setAmenities(data.amenities);
      })
      .catch((error) => {
        toast.error("Error fetching amenities:", error);
      });
    }
  }, [isOpen, amenitiesAll.length]);

  const back = () => {
    if (step > Steps.INFO) {
      setStep((value) => value - 1);
    }
  };

  const next = async () => {
    const isValid = await trigger();
    if (isValid && step < Steps.FINISH) {
      if(step==Steps.PRICES){
        toast('Please note that the dates you have not set rates from will not be bookable', {
          duration: 3000,
          position: 'top-center',
          icon: '!'});
      }
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
        setuploadedImages((prevImages) => prevImages.filter(image => image.key !== key));
      } else {
        toast.error(response.headers.get("message") || "Error deleting image");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  }

  return (
    <ModalBase isOpen={isOpen} onClose={()=>{onClose(); reset(); setStep(Steps.INFO)}} height="h-[80vh]">
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900">{Steps[step]}</h3>
        </div>
        {step === Steps.AMENITY && (
        <div className="text-black">
            <p>What amenities does your unit have?</p>
              <ul className="m-6 grid grid-cols-2 gap-2">
              {amenitiesAll.map((amenity) => (
                <li key={amenity.id} className="flex items-center">
                  <label htmlFor={amenity.name}>
                  <input id={amenity.name} type="checkbox" value={amenity.id} {...register("amenities")}/>
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
              <option value="" hidden>What kind of unit?</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Apartment">Apartment</option>
              <option value="Room">Room</option>
            </select>
            <p className="error">{errors?.type?.message?.toString()}</p>
            <input
              {...register("title", {
                required: "Title is required",
                minLength: {
                value: 2,
                message: "Title must be at least 2 characters"}})}
                type="text"
                name="title"
                placeholder="Title"
                className="form-input"/>
            <p className="error">{errors?.title?.message?.toString()}</p>
            <textarea {...register("description", {
                        required: "Description is required",
                        minLength: {
                          value: 2,
                          message: "Description must be at least 2 characters",
                        },
                        maxLength: {
                          value: 200,
                          message: "Description is limited to 200 characters"
                        }})}
                        name="description" placeholder="Description" className="form-input" />
            <p className="error">{errors?.description?.message?.toString()}</p>
            <input {...register("capacity", {
                      required: "Capacity is required",
                      min: {
                        value: 1,
                        message: "Capacity minimum is 1!"}})}
                      type="number" name="capacity" placeholder="Capacity" className="form-input"/>
            <p className="error">{errors?.capacity?.message?.toString()}</p>
            <p className="m-2"> Inquiry based reservations?</p>
            <input  {...register("inquiry", {
                      required: "Choose option" })}
                      className="m-2" type="radio" id="yes" value="true" />
            <label htmlFor="yes">Yes</label>
            <input {...register("inquiry",{
                      required :"Choose option"})}
                      className="m-2" type="radio" id="no" value=''/>
            <label htmlFor="no">No</label>
            <p className="error">{errors?.inquiry?.message?.toString()}</p>
          </div>
        )}
        {step === Steps.ROOMS && (
          <div className="text-black">
            <input {...register("bedrooms", {
                      required: "Bedroom count is required",
                      min:{
                        value:0,
                        message: "Minimum count is 0!"}})}
                      type="number" min={0} name="bedrooms" placeholder="Bedrooms" className="form-input"/>
            <p className="error">{errors?.bedrooms?.message?.toString()}</p>
            <input {...register("beds", {
                    required: "Bed count is required",
                    min:{
                      value:0,
                      message: "Minimum count is 0!"}})}
                      type="number" min={0} name="beds" placeholder="Beds" className="form-input"/>
            <p className="error">{errors?.beds?.message?.toString()}</p>
            <input {...register("bathrooms", {
                      required: "Bathroom count is required", 
                      min:{
                        value:0,
                        message: "Minimum count is 0!"}})}
                      type="number" min={0} name="bathrooms" placeholder="Bathrooms" className="form-input"/>
            <p className="error">{errors?.bathrooms?.message?.toString()}</p>
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
              endpoint={uploadedImages.length>0? "imageAcc":"imageUnit"}
              onClientUploadComplete={(res) => {
                const imageFiles = res.map((file) => ({ url: file.url, key: file.key }));
                setuploadedImages((prev) => [...prev, ...imageFiles]);
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}/>
            <div className="uploaded-images">
                {uploadedImages?.map((image, index) => (
                  <div key={index} className="items-center">
                    <button type="button" onClick={() => handleDeleteImage(image.key)}
                      className="relative right-1 top-3 bg-red-500 text-white rounded-full py-1 px-2">
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
              <PriceListForm priceList={priceList} setPriceList={setPriceList} />
          </div>
        )}
        {step === Steps.FINISH && (
          <div className="flex flex-col items-center mt-6">
            <p>Click <strong className="text-purple-800">Save</strong> to save the unit</p>
            <p className="mt-4">No need to worry, you can always change </p>
            <p>anything you are not pleased with</p>
          </div>
        )}
        <div className="absolute bottom-3 left-0 w-full flex justify-center">
          <button type="button" onClick={back} className={`form_button ${step === Steps.INFO ? "hidden" : ""}`}>
            Back
          </button>
          <button type="button" onClick={next} className={`form_button ${step === Steps.FINISH ? "hidden" : ""}`}>
            Next
          </button>
        {step === Steps.FINISH && (
          <button type="submit" className="form_button">Save</button>
        )}
      </div>
    </form>
  </div>
  </ModalBase>
  );
};

export default UnitModal;