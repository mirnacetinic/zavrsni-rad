import getUser from "../actions/getUser";
import { PanelNav } from "../components/navigation/panelnav";
import '../dashboard/style.css';


const HostBoard = async () => {
    const user = await getUser();
    return (
        <div className="container mx-auto px-4 py-8">
            {user ? (
                <>
                    {user.role === "HOST" ? (
                        <>
                            <h1 className="text-2xl font-semibold mb-4">Welcome, {user.name}!</h1>
                            <PanelNav path="hostboard"
                                options={[
                                    'Accommodations', 
                                     'Reservations',
                                    'Insights']}/> 
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
