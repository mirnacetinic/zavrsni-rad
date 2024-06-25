import InfoCard from "@/app/components/cards/infocard";
import getUser from "../../../actions/getUser";
import { getDashReviews, getDashUpcoming } from "@/app/actions/getDashInfo";

const Dashboard = async () => {
  const user = await getUser();
  const requests = await getDashReviews("Reported");
  const { upcoming, checkingInToday } = await getDashUpcoming();
  return (
    <div className="container mx-auto px-4 py-8">
      {user ? (
        <div>
          {user.role === "ADMIN" ? (
            <>
              <h1 className="text-2xl font-semibold mb-4">
                Welcome, {user.name}!
              </h1>

              <div>
                <h2 className="text-xl font-semibold m-2">Checking In today</h2>
                {checkingInToday.length > 0 ? ( <InfoCard data={checkingInToday} type="reservation" />
                ) : (
                  <p className="m-2 font-semibold">No check-ins today</p>
                )}
                <h2 className="text-xl font-semibold m-2">Upcoming</h2>
                {upcoming.length > 0 ? (
                  <InfoCard data={upcoming} type="reservation" />
                ) : (
                  <p className="m-2 font-semibold">No upcoming reservations</p>
                )}
              </div>

              <h2 className="text-xl font-semibold m-2">
                Rewiews requested to be removed
              </h2>
              {requests.length > 0 ? (
                <div>
                  <InfoCard type="review" data={requests} />
                </div>
              ) : (
                <div>
                  <p className="m-2 font-semibold">
                    No requests to remove reviews
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-lg">
              You do not have permission to view this site.
            </div>
          )}
        </div>
      ) : (
        <div className="text-lg">You need to sign in to see the dashboard.</div>
      )}
    </div>
  );
};

export default Dashboard;
