import { getAccommodations } from "../../actions/getInfo";
import Searchbar from "../../components/navigation/searchbar";
import ViewList from "@/app/components/cards/viewlist";

const Accommodations = async ({ searchParams }:{ searchParams?: { whereTo?: string; checkIn?: string; checkOut?: string; guests?: string } }) => {
  const accommodations = await getAccommodations(searchParams);
    return (
      <div className="flex bg-gray-200">
        <div className="w-full container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <Searchbar searchParams={searchParams} />
          </div>
          <div>
            <ViewList accommodations={accommodations || []}/>
          </div>
        </div>
      </div>
    );
};

export default Accommodations;
