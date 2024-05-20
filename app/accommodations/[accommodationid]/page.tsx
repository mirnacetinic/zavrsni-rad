import getAccommodation from "@/app/actions/getAccomodation";
import getUser from "@/app/actions/getUser";
import UnitCard from "@/app/components/cards/unitcard";
import { MdLocationPin, MdPerson, MdStar} from "react-icons/md";

const AccommodationView = async ({params}: {params: { accommodationid: string;}})  => {
    if(params){
        const accommodation = await getAccommodation(params.accommodationid);
        const user = await getUser();
        if(accommodation){
            return (
              <div className="w-full max-w-6xl mx-auto p-4">
              <div className="mb-4 flex flex-col items-center md:flex-row">
                {accommodation.imageUrl && (
                  <img src={accommodation.imageUrl} className="object-center h-[40vh] md:w-[60vw] md:h-[70vh] rounded-md shadow-md mb-4 md:mr-6"
                    alt="Accommodation"/>
                )}
                <div className="w-full h-40 border border-gray-200 rounded p-4">
                    <MdStar className="text-yellow-500 mr-1" />
                    <p className="font-semibold">Rating</p>
                    <MdPerson className="mr-1" />
                    <p className="font-semibold">{accommodation.user}</p>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-4">{accommodation.title}</h1>
                <h3 className="text-xl font-semibold mb-2 flex items-center">
                  {accommodation.type} - <MdLocationPin className="mr-2" /> {accommodation.city}, {accommodation.country}
                </h3>
                <p className="text-lg mb-4">{accommodation.description}</p>
              </div>
              {accommodation.units.length !== 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Units:</h2>
                  {accommodation.units.map((unit: any, index: number) => (
                    <UnitCard key={index} user={user} unit={unit} />
                  ))}
                </div>
              )}
            </div>
          );
        };

    } else {
        return(
            <div>Something went wrong...</div>
        )
    }
}

export default AccommodationView;
