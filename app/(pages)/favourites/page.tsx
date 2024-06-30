import { getFavourites } from "../../actions/getInfo";
import getUser from "../../actions/getUser";
import AccomodationCard from "../../components/cards/accomodationcard";

const Favourites = async () => {
const user = await getUser();
if(user){
  const accommodations = await getFavourites(user.id);
  if(accommodations){
    return (
      <div className="flex">
        <div className="w-full container mx-auto px-4 py-8">
          <h1>My Favourites</h1>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {accommodations.length === 0 ? (
              <div className="text-gray-600">Sorry, you do not have any favourites!</div>
            ) : (
              accommodations.map((accommodation: any) => (
                <div key={accommodation.id}>
                  <h1 className="text-center"><strong>{accommodation?.unit}</strong> at:</h1>
                  <AccomodationCard key={accommodation.id} data={accommodation}/>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }
}
else{
    return(<div>Login to see favourites</div>);
}
};

export default Favourites;
