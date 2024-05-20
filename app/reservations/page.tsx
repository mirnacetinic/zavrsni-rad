import { getReservations } from "../actions/getInfo";
import getUser from "../actions/getUser";
import ReservationCard from "../components/cards/reservationcard";

const ReservationsPage = async () => {
    const user = await getUser();
    if(!user){
        return (<div>You need to login to see reservations</div>)
    }
    const reservations = await getReservations(user.id);
    return(
        <div>
        <div>My reservations</div>
        <div className="flex">
            {reservations.length === 0? (<div>Looks like you don't have any reservations</div>):
            (<div className="grid grid-cols-2 gap-6 w-full">
                {reservations.map((r, index)=>(
                    <ReservationCard key={index} reservation={r}/>
                )
                )}
            </div>)

            }

        </div>
        </div>
    )

}

export default ReservationsPage;