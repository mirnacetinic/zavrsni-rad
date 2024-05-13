import { getLocations, getUsers, getAccommodations, getAmenities, getReservations, getUnits} from "../actions/getInfo";
import getUser from "../actions/getUser";
import Panel from "../components/cards/panel";


const fetchData = async () => {
    const user = await getUser();
    const users = await getUsers();
    const accommodations = await getAccommodations();
    const locations = await getLocations();
    const amenities = await getAmenities();
    const reservations = await getReservations();
    const units = await getUnits();

    return { user, users, accommodations, locations, amenities, reservations, units };
    
};

const Dashboard = async () => {
    const { user, users, accommodations, locations, amenities, reservations, units } = await fetchData();
    return (
        <div className="container mx-auto px-4 py-8">
            {user? (
                <>
                    {user.role === "ADMIN" ? (
                        <>
                            <h1 className="text-2xl font-semibold mb-4">Welcome, {user.name}!</h1>
                            <Panel
                                options={[
                                    { label: 'Users', data: users},
                                    { label: 'Accommodations', data : accommodations },
                                    { label: 'Units', data: units },
                                    { label: 'Amenities', data: amenities },
                                    { label: 'Locations', data: locations },
                                    { label: 'Reservations', data: reservations },
                                    { label: 'Insights', data: [] }]}/> 
                        </>
                    ) : (
                        <div className="text-lg">You don't have permission to view this site.</div>
                    )}
                </>
            ) : (
                <div className="text-lg">You need to sign in to see the dashboard.</div>
            )}
        </div>
    );
}

export default Dashboard;
