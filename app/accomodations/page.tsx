import { getAccomodations } from "../actions/getInfo";
import AccomodationCard from "../components/cards/accomodationcard";
import Searchbar from "../components/navigation/searchbar";

const Accomodations = async ({ searchParams }:{ searchParams?: { whereTo?: string; checkIn?: string; checkOut?: string; guests?: string } }) => {
  const accomodations = await getAccomodations(searchParams);

  return (
    <div className="flex">
      <div className="w-full container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <Searchbar searchParams={searchParams} />
        </div>

        <div className="sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {accomodations.length === 0 ? (
            <div className="text-gray-600">Sorry, no matches!</div>
          ) : (
            accomodations.map((accomodations: any) => (
              <AccomodationCard key={accomodations.id} data={accomodations} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Accomodations;
