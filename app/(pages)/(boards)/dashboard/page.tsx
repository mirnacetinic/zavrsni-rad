import InfoCard from "@/app/components/cards/infocard";
import getUser from "../../../actions/getUser";
import { getDashReviews } from "@/app/actions/getDashInfo";

const Dashboard = async () => {
    const user = await getUser();
    const requests = await getDashReviews("Reported");
    return (
        <div className="container mx-auto px-4 py-8">
            {user? (
                <div>
                    {user.role === "ADMIN" ? (
                        <>
                        <h1 className="text-2xl font-semibold mb-4">Welcome, {user.name}!</h1>
                        {requests.length>0 ? 
                            
                                <div>
                                    <h2>Rewiews requested to be removed</h2>
                                    <InfoCard type="review" data={requests}/>
                                </div>
                            :
                            
                                <div>
                                    <h2>No requests to remove reviews</h2>
                                </div>
                            
                        }
                        </>
                        
                    ) : (
                        <div className="text-lg">You do not have permission to view this site.</div>
                    )}
                </div>
            ) : (
                <div className="text-lg">You need to sign in to see the dashboard.</div>
            )}
        </div>
    );
}

export default Dashboard;
