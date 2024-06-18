import { getDashUpcoming } from "@/app/actions/getDashInfo";
import getUser from "../../../actions/getUser";
import "../dashboard/style.css";
import InfoCard from "@/app/components/cards/infocard";

const HostBoard = async () => {
  const user = await getUser();
  let upcoming: any[] = [];
  let checkInToday: any[] = [];

  if (user) {
    const dashInfo = await getDashUpcoming(user.id);
    upcoming = dashInfo.upcoming;
    checkInToday = dashInfo.checkingInToday;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {user ? (
        <>
          {user.role === "HOST" ? (
            <div>
              <h1 className="text-2xl font-semibold mb-4">
                Welcome, {user.name}!
              </h1>
              <h2 className="text-xl font-semibold m-2">Checking In today</h2>
              {checkInToday.length > 0 ? (
                <InfoCard data={checkInToday} type="host" />
              ) : (
                <p className="m-2 font-semibold">No check-ins today</p>
              )}
              <h2 className="text-xl font-semibold m-2">Upcoming</h2>
              {upcoming.length > 0 ? (
                <InfoCard data={upcoming} type="host" />
              ) : (
                <p className="m-2 font-semibold">No upcoming reservations</p>
              )}
            </div>
          ) : (
            <div className="text-lg">
              You do not have permission to view this site.
            </div>
          )}
        </>
      ) : (
        <div className="text-lg">You need to sign in to see the HostBoard.</div>
      )}
    </div>
  );
};

export default HostBoard;
