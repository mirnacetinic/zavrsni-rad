import { getDashAccommodation } from '@/app/actions/getInfo';
import '../../dashboard/style.css';
import getUser from "@/app/actions/getUser";
import InfoCard from '@/app/components/cards/infocard';

const AccommodationsPage = async () =>{
    const user = await getUser();
    if(user) {
    const accommodations = await getDashAccommodation(user.id);
    return(
        <div className="main-div">
        <div className="title">
            Accommodations 
            {/* <HostModal user={user} isOpen={true} onClose={()=>{}}/>    */}
            </div>
        <div className="info">
        <InfoCard data={accommodations} type='accommodation'/>
        </div>
        </div>
    )
}}

export default AccommodationsPage;