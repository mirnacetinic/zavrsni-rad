import { getReservations } from "../../actions/getInfo";
import getUser from "../../actions/getUser";
import ReservationCard from "../../components/cards/reservationcard";

const ReservationsPage = async () => {
    const user = await getUser();
    if(!user){
        return (
            <div>You need to login to see reservations</div>
        );
    }
    const reservations = await getReservations(user.id);
    return(
        <div>
            <h1 className="mx-auto p-4">My reservations</h1>
            <div className="flex">
                {reservations.length === 0?
                    <div>Looks like you do not have any reservations yet</div>
                    :
                    <div className="grid grid-cols-2 gap-6 w-full">
                        {reservations.map((reservation, index)=>(
                            <ReservationCard key={index} reservation={reservation} email={user.email}/>)
                        )}
                    </div>
                }

            </div>
        </div>
    )

}

export default ReservationsPage;