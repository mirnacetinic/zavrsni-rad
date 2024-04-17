import getInfo from "../actions/getInfo";
import getUser from "../actions/getUser";
import Panel from "../components/panel";

const Dashboard = async () => {
    const user = await getUser();

    return (
        <div className="container mx-auto px-4 py-8">
            {user ? (
                <>
                    {user.role === "ADMIN" ? (
                        <>
                            <h1 className="text-2xl font-semibold mb-4">Welcome, {user.name}!</h1>
                            <Panel
                                options={[
                                    { label: 'Users', data: await getInfo('users') },
                                    { label: 'Listings', data: await getInfo('listings') },
                                    { label: 'Locations', data: await getInfo('locations') },
                                    { label: 'Reservations', data: [] },
                                    { label: 'Insights', data: [] }
                                ]}
                            />
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
