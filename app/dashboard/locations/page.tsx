import { getLocations } from "@/app/actions/getInfo";
import InfoCard from "@/app/components/cards/infocard";
import '../style.css';
import Form from "@/app/components/inputs/form";

const LocationsPage = async () =>{
    const locations = await getLocations();
    return(
        <div className="main-div">
        <div className="title">
            Locations
            <Form type='location'/>
        </div>
        <div className="info">
            <InfoCard data={locations} type='location' />
        </div>
        </div>
        
    )
}

export default LocationsPage;