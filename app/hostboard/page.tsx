import { getHostAccommodation} from "../actions/getInfo";
import getUser from "../actions/getUser";
import Panel from "../components/cards/panel";


const HostBoard = async () => {
    const user = await getUser();
    return (
        <div className="container mx-auto px-4 py-8">
            {user ? (
                <>
                    {user.role === "HOST" ? (
                        <>
                            <h1 className="text-2xl font-semibold mb-4">Welcome, {user.name}!</h1>
                            <Panel
                                options={[
                                    { label: 'My Accommodations', data: await getHostAccommodation(user.id)},
                                    { label: 'Reservations', data: [] },
                                    { label: 'Insights', data: [] }]}/> 
                        </>
                    ) : (
                        <div className="text-lg">You don't have permission to view this site.</div>
                    )}
                </>
            ) : (
                <div className="text-lg">You need to sign in to see the HostBoard.</div>
            )}
        </div>
    );
}

export default HostBoard;
