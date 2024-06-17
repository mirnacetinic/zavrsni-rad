import getAccommodation from "@/app/actions/getAccomodation";
import { getAccommodationUnits } from "@/app/actions/getInfo";
import getUser from "@/app/actions/getUser";
import UnitCard from "@/app/components/cards/unitcard";
import { MdLocationPin, MdOutlineStarPurple500, MdOutlineStarHalf, MdPerson } from "react-icons/md";

const AccommodationView = async ({ params, searchParams}: {params: { accommodationid: string }, searchParams?: { checkIn? : string, checkOut? : string, guests? : string}}) => {
  if (params) {
    const accommodation = await getAccommodation(params.accommodationid);
    const user = await getUser();
    if (accommodation) {
      const renderStars = (rating: number | null): JSX.Element | string => {
        if (rating === null) {
          return "No reviews yet";
        }
    
        const roundedRating = Math.floor(rating)
        const stars = [];
        for (let i = 1; i <= roundedRating; i++) {
          stars.push(<MdOutlineStarPurple500 key={i} className="text-purple-500" size={20} />);
        }
        if (rating - roundedRating > 0.4) {
          stars.push(<MdOutlineStarHalf key="half" className="text-purple-500" size={20} />);
        }
        return <>{stars}</>;
      };
      const {safeUnits, theRest} = (await getAccommodationUnits(accommodation.id, searchParams));
      return (
        <div className="w-full max-w-6xl mx-auto p-4">
          <div className="mb-4 flex flex-col items-center md:flex-row">
            {accommodation.imageUrl && (
              <img src={accommodation.imageUrl} className="object-center h-[40vh] md:w-[60vw] md:h-[70vh] rounded-md shadow-md mb-4 md:mr-6" alt="Accommodation"/>
            )}
            <div className="flex flex-col w-fit h-fit border border-gray-200 rounded p-4">
              <div className="flex items-center">
                  <MdPerson className="mr-1" size={20} />
                  <p className="font-semibold">Host: {accommodation.user}</p>
              </div>
              <div className="flex items-center">
                <MdOutlineStarPurple500 className="mr-1" size={20}/>
                <p className="font-semibold mr-2">Rating: </p>
                {renderStars(accommodation.rating)}
              </div>
              {accommodation.reviews && accommodation.reviews.length>0 && (
                <>
                <p className="font-semibold">Latest Reviews:</p>
                <div className="flex flex-row">
                  {accommodation.reviews?.map((r, i)=>
                  <div className="mx-1 w-fit p-2 border border-lg rounded-lg" key={i}>
                    <p className="text-semibold italic w-full">{r.unit}</p>
                    <p className="flex flex-row">Unit:{renderStars(r.rating)}</p>
                    <p className="flex flex-row">Host:{renderStars(r.hostRating)}</p>
                    <p className="italic text-gray-500">{r.experience}</p>
                  </div>
                  )}
                </div>
                </>
              )}
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
