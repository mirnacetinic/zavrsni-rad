import { Location } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";
import UnitModal from "./unitmodal";
import { UploadButton } from "@/app/utils/uploadthing";
import Image from "next/image";
import {
  MdOutlineApartment,
  MdOutlineBedroomParent,
  MdOutlineHouse,
  MdOutlineVilla,
} from "react-icons/md";
import { SafeUser } from "@/app/types/type";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SafeUser;
}

enum Steps {
  AGREEMENT,
  TYPE,
  INFO,
  IMAGE,
  UNITS,
  FINISH,
}

const HostModal = ({ isOpen, onClose, user }: ModalProps) => {
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
      type: "",
      locationId: "",
      agree: "",
      unitsNo: "",
      description: "",
      title: "",
      address: "",
    },
  });

  const router = useRouter();

  const [step, setStep] = useState(
    user.role === "HOST" ? Steps.TYPE : Steps.AGREEMENT
  );
  const [locations, setLocations] = useState<Location[]>([]);
  const [units, setUnits] = useState<FieldValues[]>([]);
  const [unitOpen, setUnitOpen] = useState(false);
  const [image, setImage] = useState<{ url: string; key: string }>({
    url: "",
    key: "",
  });
  const [type, setType] = useState<string>("");

  const handleAddUnit = (unitData: FieldValues) => {
    setUnits((prevUnits) => [...prevUnits, unitData]);
    openUnit();
  };

  const removeUnit = (index: number) => {
    const updatedUnits = [...units];
    updatedUnits.splice(index, 1);
    setUnits(updatedUnits);
  };

  const openUnit = () => {
    setUnitOpen((prev) => !prev);
  };

  const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "No") {
      onClose();
    }
  };

  useEffect(() => {
    fetch("/api/location")
      .then((res) => res.json())
      .then((data) => {
        setLocations(data.locations);
      })
      .catch((error) => {
        toast.error("Error fetching locations:", error);
      });
  }, []);

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
        console.log(
          response.headers.get("message") || "Error deleting instance"
        );
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const createAccommodation = async (data: FieldValues) => {
    data.ownerId = user.id;
    data.units = units;
    data.imageUrl = image.url;
    const response = await fetch("/api/accommodation", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      toast.success("Success");
      const responseData = await response.json();
      setStep(Steps.AGREEMENT);
      onClose();
      // reset();
      router.push(`/accommodations/${responseData.id}`);
    } else {
      const errorMessage = await response.text();
      toast.error(errorMessage);
    }
  };

  return (
    <>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-70 z-50 animate-fadeIn">
            <div className="fixed inset-0 flex items-center justify-center z-50 animate-slideInDown">
              <div className="p-8 border h-96 w-96 shadow-lg rounded-md bg-white relative">
                <div
                  className="absolute text-black top-2 right-2 cursor-pointer"
                  onClick={onClose}
                >
                  <AiOutlineClose />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {Steps[step]}
                  </h3>
                </div>
                {step === Steps.AGREEMENT && (
                  <div className="text-black">
                    <p className="m-2">
                      Do you agree to hosting your property on StayAway?
                    </p>
                    <input
                      className="m-2"
                      type="radio"
                      id="agree"
                      value="Yes"
                      {...register("agree", {
                        required: "You must agree to continue!",
                      })}
                    />
                    <label htmlFor="agree">Yes</label>
                    <input
                      className="m-2"
                      type="radio"
                      id="disagree"
                      value="No"
                      onChange={handleAgreementChange}
                    />
                    <label htmlFor="disagree">No</label>
                    <p className="mt-3 text-gray-500">
                      <small>
                        *By agreeing to host your property on StayAway, you
                        acknowledge and accept our terms of service, including
                        our privacy policy and community guidelines. Your
                        commitment ensures a safe and respectful environment for
                        all users.*
                      </small>
                    </p>
                    <p className="error">{errors?.agree?.message}</p>
                  </div>
                )}

                {step === Steps.TYPE && (
                  <div className="text-black flex flex-col items-center">
                    <p className="mb-2 text-center">
                      What best describes your property?
                    </p>
                    <div className="m-2 flex flex-row items-center">
                      <MdOutlineHouse
                        className={`text-3xl cursor-pointer ${
                          type === "House" ? "text-purple-500" : "text-gray-400"
                        }`}
                        onClick={() => {
                          setValue("type", "House");
                          setType("House");
                        }}
                      />
                      <span className="m-2">House</span>
                      <MdOutlineVilla
                        className={`text-3xl cursor-pointer ${
                          type === "Villa" ? "text-purple-500" : "text-gray-400"
                        }`}
                        onClick={() => {
                          setValue("type", "Villa");
                          setType("Villa");
                        }}
                      />
                      <span className="m-2">Villa</span>
                    </div>
                    <div className="m-2 flex flex-row items-center">
                      <MdOutlineApartment
                        className={`text-3xl cursor-pointer ${
                          type === "Apartment"
                            ? "text-purple-500"
                            : "text-gray-400"
                        }`}
                        onClick={() => {
                          setValue("type", "Apartment");
                          setType("Apartment");
                        }}
                      />
                      <span className="m-2">Apartment</span>
                      <MdOutlineBedroomParent
                        className={`text-3xl cursor-pointer ${
                          type === "Room" ? "text-purple-500" : "text-gray-400"
                        }`}
                        onClick={() => {
                          setValue("type", "Room");
                          setType("Room");
                        }}
                      />
                      <span className="m-2">Room</span>
                    </div>
                    <p className="error">{errors?.type?.message}</p>
                    <input
                      {...register("type", {
                        required: "Select the type of property",
                      })}
                      type="hidden"
                    />
                    <input
                      {...register("unitsNo", {
                        required: "Select number of units",
                        min: {
                          value: 1,
                          message:
                            "Your accommodation must have at least 1 unit!",
                        },
                      })}
                      type="number"
                      id="unitsNo"
                      min={1}
                      className="text-center form-input"
                      placeholder="How many units are there?"
                    />
                    <p className="error">{errors?.unitsNo?.message}</p>
                  </div>
                )}

                {step === Steps.INFO && (
                  <div className="text-black mt-6">
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
                    <textarea
                      {...register("description", {
                        required: "Description is required",
                        minLength: {
                          value: 2,
                          message: "Description must be at least 2 characters",
                        },
                        maxLength: {
                          value: 200,
                          message: "Description is limited to 200 characters",
                        },
                      })}
                      name="description"
                      placeholder="Description"
                      className="form-input"
                    />
                    {errors?.description && (
                      <p className="error">{errors?.description.message}</p>
                    )}
                    <select
                      {...register("locationId", {
                        required: "Location is required",
                      })}
                      className="form-input"
                      name="locationId"
                    >
                      <option className="text-gray-400" value="">
                        Select Location
                      </option>
                      {locations?.map((location, index) => (
                        <option
                          className="text-black"
                          key={index}
                          value={location.id}
                        >
                          {location.city}, {location.country}
                        </option>
                      ))}
                    </select>
                    <p className="error">{errors?.locationId?.message}</p>
                    <input
                      {...register("address", {
                        required: "Address is required",
                        minLength: {
                          value: 3,
                          message: "Address must be at least 3 characters",
                        },
                      })}
                      type="text"
                      name="address"
                      placeholder="Address"
                      className="form-input"
                    />
                    <p className="error">{errors?.address?.message}</p>
                  </div>
                )}

                {step === Steps.IMAGE && (
                  <>
                    <UploadButton
                      className={`${image.url.length > 0 ? "hidden" : ""}`}
                      appearance={{
                        button({ ready, isUploading }) {
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
                      onUploadError={(error: Error) => {
                        alert(`ERROR! ${error.message}`);
                      }}
                    />
                    {image.url ? (
                      <div key="Image" className="relative flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(image.key)}
                          className="absolute top-0 right-0  bg-red-500 text-white rounded-full py-1 px-2"
                        >
                          x
                        </button>
                        <Image
                          src={image.url}
                          alt="Pic"
                          width={200}
                          height={100}
                        />
                      </div>
                    ) : null}
                  </>
                )}

                {step === Steps.UNITS && (
                  <div className="text-black">
                    <p>Add units to your accommodation:</p>
                    {units.map((unit, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between mt-2"
                      >
                        <span>
                          Unit {index + 1}: {unit.type} {unit.title}
                        </span>
                        <AiOutlineClose onClick={() => removeUnit(index)} />
                      </div>
                    ))}
                    {units.length < parseInt(getValues("unitsNo")) && (
                      <button onClick={openUnit} className="form_button">
                        Add Unit
                      </button>
                    )}
                    <UnitModal
                      isOpen={unitOpen}
                      onClose={openUnit}
                      onAddUnit={handleAddUnit}
                    />
                  </div>
                )}

                <div className="absolute bottom-3 left-0 w-full flex justify-center">
                  <button
                    onClick={back}
                    className={`form_button ${
                      step === Steps.AGREEMENT ||
                      (step === Steps.TYPE && user.role == "HOST")
                        ? "hidden"
                        : ""
                    }`}
                  >
                    Back
                  </button>
                  <button
                    onClick={next}
                    className={`form_button ${
                      step === Steps.FINISH ? "hidden" : ""
                    }`}
                  >
                    Next
                  </button>
                  {step === Steps.FINISH && (
                    <button
                      onClick={handleSubmit(createAccommodation)}
                      className="form_button"
                    >
                      Create
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default HostModal;
