import { getAccommodations } from "../actions/getInfo";
import AccomodationCard from "../components/cards/accomodationcard";
import Searchbar from "../components/navigation/searchbar";

const Accommodations = async ({ searchParams }:{ searchParams?: { whereTo?: string; checkIn?: string; checkOut?: string; guests?: string } }) => {
  const accommodations = await getAccommodations(searchParams);
  if(accommodations){
    return (
      <div className="flex bg-gray-300">
        <div className="w-full container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <Searchbar searchParams={searchParams} />
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {accommodations.length === 0 ? (
              <div className="text-gray-600">Sorry, no matches!</div>
            ) : (
              accommodations.map((accommodations: any) => (
                <AccomodationCard key={accommodations.id} data={accommodations}/>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default Accommodations;
