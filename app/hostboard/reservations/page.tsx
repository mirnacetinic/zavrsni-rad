import { getReservations } from "@/app/actions/getInfo";
import InfoCard from "@/app/components/cards/infocard";
import '../../dashboard/style.css';
import Form from "@/app/components/inputs/form";

const ReservationsPage = async () =>{
    const reservations = await getReservations();
    return(
        <div className="main-div">
        <div className="title">
            Reservations
            <Form type='reservation'/>
        </div>
        <div className="info"><InfoCard data={reservations} type='reservation' /></div>
        </div>
    )
}

export default ReservationsPage;