import getAccmodation from "@/app/actions/getAccomodation";
import UnitCard from "@/app/components/cards/unitcard";

const  accommodationView = async ({params}: {params: { accommodationid: string;}}) => {
    if(params){
        const accommodation = await getAccmodation(params.accommodationid);
        if(accommodation){
            return(
                <div>
                    <div className="grid grid-cols-2 gap-1 mb-4">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="h-40 bg-gray-300"></div> 
                        ))}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold mb-4">{accommodation.title}</h1>
                        <h3 className="text-xl font-semibold mb-2">
                            {accommodation.type} - {accommodation.city}, {accommodation.country}
                        </h3>
                        <p className="text-lg mb-4">{accommodation.description}</p>
                    </div>
                   
                    {accommodation.units.length !=0 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Units:</h2>
                        <ul>
                            {accommodation.units.map((unit, index) => (
                                <UnitCard unit={unit} key={index}/>
                            ))}
                        </ul>
                    </div>)}
                </div>
            )
        }

    }else{
        return(
            <div>Something went wrong...</div>
        )
    }
}


export default accommodationView;

