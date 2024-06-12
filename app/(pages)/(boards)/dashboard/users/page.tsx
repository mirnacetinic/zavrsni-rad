import { getDashUsers } from "@/app/actions/getDashInfo";
import InfoCard from "@/app/components/cards/infocard";
import '../style.css';
import Form from "@/app/components/inputs/form";
import Chart from "@/app/components/cards/chart";
import StatCard from "@/app/components/cards/statcard";


const UsersPage = async () => {
    const users = await getDashUsers();
    let reservations = 0;

    const countByCountry: { [key: string]: number } = {};
    const countByRole = {
        ADMIN: 0,
        USER: 0,
        HOST: 0
    };

    const countByStatus = {
        Active: 0,
        Suspended: 0,
        Inactive: 0
    };


    const hosts = users.filter(user => user.role === 'HOST').map(user=>{
        const{writtenReviews, reservations, guestRatings, ...hostData} = user;
        return hostData;
    });
    const allUsers = users.map(user => {
        const { accommodations, hostedReservations,revenue, ...data } = user;
        return data;
    });


    allUsers.forEach(user => {
        countByCountry[user.country] = (countByCountry[user.country] || 0) + 1;
        countByRole[user.role]++;
        countByStatus[user.status]++;
        if(user.reservations!=="None") reservations += user.reservations.length;
   
    });

    let hostReservations = 0;
    hosts.forEach(host => {
        hostReservations += host.hostedReservations.length;
    });

    const chartData = {
        labels: ['Admin', 'User', 'Host'],
        datasets: [
            {
                data: [countByRole['ADMIN'], countByRole['USER'], countByRole['HOST']],
                backgroundColor: ['pink', 'lightblue', 'indianred'],
            }
        ]
    };

    const countryData = {
        labels: Object.keys(countByCountry),
        datasets: [
            {
                data: Object.values(countByCountry),
                backgroundColor: ['crimson','orchid','gold','bisque','darkblue','coral', 'darkcyan', 'magenta'],
            }
        ]
    };

    const statusData = {
        labels: ['Active', 'Inactive', 'Suspended'],
        datasets: [
            {
                data: [countByStatus['Active'], countByStatus['Inactive'], countByStatus['Suspended']],
                backgroundColor: ['lightgreen', 'orange', 'red']
            }
        ]
    };

    return (
        <div className="main-div">
            <div className="title">
                Users
                <Form type='user' />
            </div>
            {allUsers.length !== 0 && (
                <>
                    <div className="info">
                        <InfoCard data={allUsers} type='user' />
                        {hosts.length !== 0 && (
                        <div className="mt-4">
                           <h1 className="text-xl"> Hosts</h1>
                        <InfoCard data={hosts} type='user' />
                        <StatCard title="Hosts statistics:"
                            body={[
                                { label: 'Total hosts:', data: hosts.length },
                                { label: 'Total reservations:', data: hostReservations },
                                { label: 'Avg. reservations per host:', data: hostReservations / hosts.length }
                            ]} />
                            </div>
                        )}
                        <StatCard title="Users statistics:"
                            body={[
                                { label: 'Total users:', data: allUsers.length },
                                { label: 'Total reservations:', data: reservations },
                                { label: 'Avg. reservations per user:', data: reservations / allUsers.length }
                            ]} />
                    </div>
                    <div className="charts">
                        <Chart type="pie" data={chartData} title="Users By Roles" showLegend={true} />
                        <Chart type="pie" data={statusData} title="Users By Status" showLegend={true} />
                        <Chart type="bar" data={countryData} title="Users By Country" showLegend={false} />
                    </div>
                </>
            )}
        </div>
    );
};

export default UsersPage;
