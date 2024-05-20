import { getHostAccommodation } from "@/app/actions/getInfo";
import InfoCard from "@/app/components/cards/infocard";
import '../../dashboard/style.css';
import Form from "@/app/components/inputs/form";
import getUser from "@/app/actions/getUser";

const AccommodationsPage = async () =>{
    const user = await getUser();
    if(user) {
    const accommodations = await getHostAccommodation(user.id);
    return(
        <div className="main-div">
        <div className="title">
            Accommodations <Form type='accommodation' />
        </div>
        <div className="info">
        <InfoCard data={accommodations} type='accommodation'/>
        </div>
        </div>
    )
}}

export default AccommodationsPage;