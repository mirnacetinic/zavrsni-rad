import { useForm, FieldValues } from "react-hook-form";
import { useState, useEffect } from "react";
import UnitModal from "./unitmodal";
import { MdOutlineHouse, MdOutlineVilla, MdOutlineApartment, MdOutlineBedroomParent, MdOutlineModeEdit, MdDelete } from "react-icons/md";
import { SafeAccommodation, SafeUser } from "@/app/types/type";
import { useRouter } from "next/navigation";
import { Location } from "@prisma/client";
import toast from "react-hot-toast";
import Image from "next/image";
import { UploadButton } from "@/app/utils/uploadthing";
import ModalBase from "../cards/modalbase";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SafeUser;
  accommodation?: SafeAccommodation;
  locationsList? : Location[];
}

enum Steps {
  AGREEMENT,
  TYPE,
  INFO,
  IMAGE,
  UNITS,
  FINISH,
}

const HostModal = ({ isOpen, onClose, user, accommodation, locationsList }: ModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    setValue,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      type: accommodation?.type || "",
      locationId: accommodation?.locationId.toString() || "",
      agree: "",
      unitsNo: accommodation?.units?.length.toString() || "",
      description: accommodation?.description || "",
      title: accommodation?.title || "",
      address: accommodation?.address || "",
    },
  });

  const router = useRouter();

  const [step, setStep] = useState(user.role !== "USER" ? Steps.TYPE : Steps.AGREEMENT);
  const [locations, setLocations] = useState<Location[]>(locationsList || []);
  const [units, setUnits] = useState<FieldValues[]>([]);
  const [unitOpen, setUnitOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<FieldValues | null>(null);
  const [image, setImage] = useState<{ url: string; key: string }>({url:"", key:""});
  const [type, setType] = useState<string>(accommodation?.type || "");

  const handleAddUnit = (unitData: FieldValues) => {
    if (selectedUnit) {
      setUnits((prevUnits) =>
        prevUnits.map((unit) => (unit === selectedUnit ? unitData : unit))
      );
    } else {
      setUnits((prevUnits) => [...prevUnits, unitData]);
    }
    setSelectedUnit(null);
    openUnit();
  };

  const removeUnit = (index: number) => {
    const updatedUnits = [...units];
    updatedUnits.splice(index, 1);
    setUnits(updatedUnits);
  };

  const openUnit = (unit?: FieldValues) => {
    if (unit && !unitOpen) {
      setSelectedUnit(unit);
    } else {
      setSelectedUnit(null);
    }
    setUnitOpen((prev) => !prev);
  };

  useEffect(() => {
    if (accommodation) {
      setValue("type", accommodation.type);
      setValue("title", accommodation.title);
      setValue("description", accommodation.description);
      setUnits(accommodation.units || []);
      setImage({ url: accommodation.image || "", key: accommodation.imageKey || "" });
  
    } else {
      setUnits([]);
      setImage({url:"", key:""});
      reset({
        type: "",
        title: "",
        description: "",
     
      });
    }
  }, [accommodation, setValue, reset]);

  useEffect(() => {
    if(locations.length==0 && isOpen){
    fetch("/api/location")
      .then((res) => res.json())
      .then((data) => {
        setLocations(data.locations);
      })
      .catch((error) => {
        toast.error("Error fetching locations:", error);
      });
    }
  }, [isOpen, locations.length]);

  const back = () => {
    if (step > Steps.AGREEMENT) {
      setStep((value) => value - 1);
    }
  };

  const next = async () => {
    if (step === Steps.UNITS) {
      if (units.length !== parseInt(getValues("unitsNo"))) {
        toast.error(
          "You must add the specified number of units:" + getValues("unitsNo")
        );
        return;
      }
    }
    const isValid = await trigger();
    if (isValid && step < Steps.FINISH) {
      setStep((value) => value + 1);
    }
  };

  const handleDeleteImage = async (key: string) => {
    try {
      const response = await fetch("/api/image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      if (response.ok) {
        setImage({ url: "", key: "" });
      } else {
        toast.error(response.headers.get("message") || "Error deleting image");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong!");
    }
  };

  const handleAccommodation = async (fieldData: FieldValues) => {
    const { agree, unitsNo, ...data } = fieldData;
    data.ownerId = user.id;
    data.units = units;
    data.imageUrl = image.url;
    let method = "POST";
    if(accommodation){
      method = "PUT";
      data.id = accommodation.id;
      data.ownerId = accommodation.ownerId;
    }
    const response = await fetch("/api/accommodation", {
      method: method,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      toast.success(response.headers.get("message") || "Success!");
      setUnits([]);
      setType("");
      setImage({url:"", key:""});
      setStep(Steps.TYPE);
      onClose();
      reset();
      if(method==='POST'){
        router.push(`/accommodations/${responseData.id}`);
      }
      router.refresh();
    } else {
      toast.error(response.headers.get("message"));
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} height="h-[80vh]">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900">{Steps[step]}</h3>
      </div>
      {step === Steps.AGREEMENT && (
        <div className="text-black">
          <p className="my-1">Do you agree to hosting your property on StayAway?</p>
          <div>
            <label htmlFor="agree">Yes</label>
            <input {...register("agree", {
                      required: "You must agree to continue!"})}
                      className="m-2" type="radio" id="agree" value="Yes"/>
            <label htmlFor="disagree">No</label>
            <input className="m-2" type="radio" id="disagree" value="No" onChange={onClose}/>
            </div>
              <p className="my-2 text-center text-gray-500 max-w-96">
                <small>
                  *By agreeing to host your property on StayAway, you
                  acknowledge and accept our terms of service,including
                  our privacy policy and community guidelines. Your
                  commitment ensures a safe and respectful environment for all users.*
                </small>
              </p>
            <p className="error">{errors?.agree?.message}</p>
        </div>
      )}
      {step === Steps.TYPE && (
        <div className="text-black flex flex-col items-center">
          <p className="mb-2 text-center">What best describes your property?</p>
          <div className="m-2 flex flex-row items-center">
            <MdOutlineHouse className={`text-3xl cursor-pointer ${type === "House" ? "text-purple-500" : "text-gray-400"}`}
              onClick={() => {
                setValue("type", "House");
                setType("House");
              }}
            />
            <span className="m-2">House</span>
            <MdOutlineVilla className={`text-3xl cursor-pointer ${type === "Villa" ? "text-purple-500" : "text-gray-400" }`}
              onClick={() => {
                setValue("type", "Villa");
                setType("Villa");
              }}
            />
            <span className="m-2">Villa</span>
          </div>
          <div className="m-2 flex flex-row items-center">
            <MdOutlineApartment className={`text-3xl cursor-pointer ${type === "Apartment"? "text-purple-500" : "text-gray-400"}`}
              onClick={() => {
                setValue("type", "Apartment");
                setType("Apartment");
              }}
            />
            <span className="m-2">Apartment</span>
            <MdOutlineBedroomParent className={`text-3xl cursor-pointer ${type === "Room" ? "text-purple-500" : "text-gray-400"}`}
              onClick={() => {
                setValue("type", "Room");
                setType("Room");
              }}
            />
            <span className="m-2">Room</span>
          </div>
          <p className="error">{errors?.type?.message}</p>
          <input {...register("type", {
                    required: "Select the type of property" })} type="hidden"/>
          <input {...register("unitsNo", {
                    required: "Select number of units",
                    min: {
                    value: 1,
                    message:
                      "Your accommodation must have at least 1 unit!"}})}
                    type="number" id="unitsNo" min={1} className="text-center form-input" placeholder="How many units are there?"/>
          <p className="error">{errors?.unitsNo?.message}</p>
        </div>
      )}
      {step === Steps.INFO && (
        <div className="text-black">
          <input {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 2,
                      message: "Title must be at least 2 characters"}})}
                    type="text" name="title" placeholder="Title" className="form-input"/>
          <p className="error">{errors?.title?.message}</p>
          <textarea {...register("description", {
                      required: "Description is required",
                      minLength: {
                        value: 2,
                        message: "Description must be at least 2 characters",
                      },
                      maxLength: {
                        value: 200,
                        message: "Description is limited to 200 characters",
                      }})}
                      name="description" placeholder="Tell us about your property" className="form-input"/>
          <p className="error">{errors?.description?.message}</p>
          <select {...register("locationId", {
                    required: "Location is required"})}
                    className="form-input" name="locationId">
            <option className="text-gray-400" value="">Select Location</option>
            {locations?.map((location, index) => (
              <option className="text-black" key={index} value={location.id}>
                {location.city}, {location.country}
              </option>
            ))}
          </select>
          <p className="error">{errors?.locationId?.message}</p>
          <input {...register("address", {
                    required: "Address is required",
                    minLength: {
                      value: 3,
                      message: "Address must be at least 3 characters",
                    }})}
                    type="text" name="address" placeholder="Address" className="form-input"/>
          <p className="error">{errors?.address?.message}</p>
        </div>
      )}
      {step === Steps.IMAGE && (
        <>
          <UploadButton className={`${image.url.length > 0 ? "hidden" : ""}`}
            appearance={{button({ ready, isUploading }) {
                          return {
                            background: "#6b46c1",
                            ...(ready && { color: "#ecfdf5" }),
                            ...(isUploading && { color: "#d1d5db" }),
                          };
                        },
            }}
            endpoint="imageAcc"
            onClientUploadComplete={(res) => {
              toast.success("Upload Completed");
              setImage({ url: res[0].url, key: res[0].key });
            }}
            onUploadError={(error: Error) => {alert(`ERROR! ${error.message}`);}}
          />
          {image.url ? 
          (
            <div key="Image" className="relative flex justify-center">
              <button type="button" onClick={() => handleDeleteImage(image.key)}
                className="absolute top-0 right-0  bg-red-500 text-white rounded-full py-1 px-2">
                x
              </button>
              <Image src={image.url} alt="Pic" width={200} height={100}/>
            </div>
          ) : 
          null}
        </>
      )}
      {step === Steps.UNITS && (
        <div className="text-black">
          <p>Add units to your accommodation:</p>
          {units.map((unit, index) => (
            <div key={index} className="flex items-center justify-between mt-2">
              <span className="font-semibold">Unit {index + 1}: {unit.type} {unit.title}</span>
              <div className="flex items-center">
                <MdOutlineModeEdit className="mr-2 cursor-pointer" onClick={() => openUnit(unit)}/>
                <MdDelete className="cursor-pointer" onClick={() => removeUnit(index)} />
              </div>
            </div>
          ))}
          {units.length < parseInt(getValues("unitsNo")) && (
            <button onClick={()=>openUnit()} className="form_button">Add Unit</button>
          )}
          <UnitModal isOpen={unitOpen} onClose={openUnit} onAddUnit={handleAddUnit} unit={selectedUnit}/>
        </div>
      )}
      {step === Steps.FINISH && (
          <div className="flex flex-col items-center mt-6 text-black">
            <p>Click <strong className="text-purple-800">Save</strong> to save the accommodation</p>
            <p className="mt-4">No need to worry, you can always change </p>
            <p>anything you are not pleased with</p>
          </div>
        )}
      <div className="absolute bottom-3 left-0 mt-4 w-full flex justify-center">
        <button onClick={back}
          className={`form_button ${step === Steps.AGREEMENT || (step === Steps.TYPE && user.role == "HOST")? "hidden": ""}`}>
          Back
        </button>
        <button onClick={next} className={`form_button ${step === Steps.FINISH ? "hidden" : ""}`}>
          Next
        </button>
      {step === Steps.FINISH && (
        <button onClick={handleSubmit(handleAccommodation)} className="form_button">Confirm</button>
      )}
  </div>
  </ModalBase>
  );
};

export default HostModal;
