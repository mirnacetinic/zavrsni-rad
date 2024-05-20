import { getAccommodations } from "@/app/actions/getInfo";
import InfoCard from "@/app/components/cards/infocard";
import '../style.css';
import Form from "@/app/components/inputs/form";

const AccommodationsPage = async () =>{
    const accommodations = await getAccommodations();
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
}

export default AccommodationsPage;