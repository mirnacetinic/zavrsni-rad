import getAccommodation from "@/app/actions/getAccomodation";
import { getAccommodationUnits } from "@/app/actions/getInfo";
import getUser from "@/app/actions/getUser";
import UnitCard from "@/app/components/cards/unitcard";
import {
  MdLocationPin,
  MdOutlineStarPurple500,
  MdPerson,
} from "react-icons/md";

const AccommodationView = async ({ params, searchParams}: {
  params: { accommodationid: string }
  searchParams?: { checkIn? : string, checkOut? : string, guests? : string}
}) => {
  if (params) {
    const accommodation = await getAccommodation(params.accommodationid);
    const user = await getUser();
    if (accommodation) {
      const {safeUnits, theRest} = (await getAccommodationUnits(accommodation.id, searchParams));
      return (
        <div className="w-full max-w-6xl mx-auto p-4">
          <div className="mb-4 flex flex-col items-center md:flex-row">
            {accommodation.imageUrl && (
              <img
                src={accommodation.imageUrl}
                className="object-center h-[40vh] md:w-[60vw] md:h-[70vh] rounded-md shadow-md mb-4 md:mr-6"
                alt="Accommodation"
              />
            )}
            <div className="flex flex-col w-full h-40 border border-gray-200 rounded p-4">
            <div className="flex items-center">
                <MdPerson className="mr-1" size={20} />
                <p className="font-semibold">Host: {accommodation.user}</p>
              </div>
              <div className="flex items-center">
                <MdOutlineStarPurple500 className="mr-1" size={20}/>
              <p className="font-semibold mr-2">Rating: </p>
              {accommodation.rating
                ? ([...Array(accommodation.rating)].map((_, index) => (
                    <MdOutlineStarPurple500
                      key={index}
                      className="text-purple-500"
                      size={20}
                    />
                  )))
                : "No reviews yet"}
              </div>
              {accommodation.reviews && accommodation.reviews.length>0 && (
              <div className="flex flex-row items-center">
                <p className="font-semibold">Reviews:</p>
                {accommodation.reviews?.map((r, i)=>(<p key={i} className="p-2 m-2">{r}</p>))}
              </div>)}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{accommodation.type} {accommodation.title}</h1>
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <MdLocationPin className="mr-2" />{" "}
              {accommodation.address}, {accommodation.city}, {accommodation.country}
            </h3>
            <p className="text-lg mb-4">{accommodation.description}</p>
          </div>
          {safeUnits.length !== 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Units:</h2>
              {safeUnits.map((unit: any, index: number) => (
                <UnitCard key={index} user={user} unit={unit} />
              ))}
            </div>
          )}
          {theRest.length !== 0 && (
            <div className="mt-8">
              <h2 className="text-xl text-gray-500 font-semibold mb-2">Units that do not meet your current requirements:</h2>
              {theRest.map((unit: any, index: number) => (
                <UnitCard key={index} user={user} unit={unit} />
              ))}
            </div>
          )}
        </div>
      );
    }
 
  return <div>Something went wrong...</div>;
  
}};

export default AccommodationView;
