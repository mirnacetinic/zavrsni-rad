import getAccommodation from "@/app/actions/getAccomodation";
import getUser from "@/app/actions/getUser";
import UnitCard from "@/app/components/cards/unitcard";
import { MdLocationPin, MdStarBorder, MdPerson} from "react-icons/md";

const AccommodationView = async ({params}: {params: { accommodationid: string;}})  => {
    if(params){
        const accommodation = await getAccommodation(params.accommodationid);
        const user = await getUser();
        if(accommodation){
            return (
                <div className="w-full items-center max-w-6xl mx-auto p-4">
                  <div className="mb-4 flex items-center">
                    {accommodation.imageUrl && (
                      <img src={accommodation.imageUrl} className="w-[60vw] h-[80vh] rounded-md shadow-md" alt="Accommodation" />
                    )}
                    <div className="m-4 border border-gray-500 rounded p-20 ">
                        <p>Rating: <MdStarBorder/></p>
                        <p>Hosted by: <MdPerson/> </p>

                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-4">{accommodation.title}</h1>
                    <h3 className="text-xl font-semibold mb-2 flex items-center">
                      {accommodation.type} -  <MdLocationPin className="m-2" /> {accommodation.city}, {accommodation.country}
                    </h3>
                    <p className="text-lg mb-4">{accommodation.description}</p>
                  </div>
            
                  {accommodation.units.length !== 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Units:</h2>
                        {accommodation.units.map((unit, index) => (
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
