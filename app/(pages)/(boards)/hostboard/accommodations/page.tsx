import { getAmenities, getDashAccommodation, getLocations } from '@/app/actions/getInfo';
import '../../dashboard/style.css';
import getUser from "@/app/actions/getUser";
import HostCard from '@/app/components/cards/hostcard';

const AccommodationsPage = async () =>{
    const user = await getUser();
    if(user && user.role=="HOST") {
    const accommodations = await getDashAccommodation(user.id);
    const amenities = await getAmenities();
    const locations = await getLocations();
    return(
        <div className="main-div">
        <div className="title">
           My Accommodations   
        </div>
        <div className="info">
        {accommodations.length> 0 && (
            <div>   
            <HostCard accommodations={accommodations} user={user} amenities={amenities} locations={locations}/>
            </div>
        )}
        </div>
        </div>
    )
}}

export default AccommodationsPage;