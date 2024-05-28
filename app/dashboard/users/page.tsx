import { getUsers } from "@/app/actions/getInfo";
import InfoCard from "@/app/components/cards/infocard";
import '../style.css';
import Form from "@/app/components/inputs/form";
import Chart from "@/app/components/cards/chart";
import StatCard from "@/app/components/cards/statcard";

const UsersPage = async () => {
    const users = await getUsers();
    let reservations = 0;

    const countByRole = {
        ADMIN: 0,
        USER: 0,
        HOST: 0
    };

    const countByStatus = {
        Active :0,
        Suspended : 0,
        Inactive : 0
    }


    users.forEach(user => {
        countByRole[user.role]++; 
        countByStatus[user.status]++;
        reservations+= user.reservations
       
    });
    
    const chartData = {
        labels: ['Admin', 'User', 'Host'],
        datasets: [
            {
                label: 'Count',
                data: [countByRole['ADMIN'], countByRole['USER'], countByRole['HOST']],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }
        ]
    };
    
    const statusData = {
        labels: ['Active', 'Inactive', 'Suspended'],
        datasets: [
            {
                label: 'Count',
                data: [countByStatus['Active'], countByStatus['Inactive'], countByStatus['Suspended']],
                backgroundColor: ['#FD6384', '#33A2EB', '#FFBE56'],
                hoverBackgroundColor: ['#FF6944', '#36A7EB', '#FCCE56']
            }
        ]
    };

    const chartOptions = {
        maintainAspectRatio : false,
        plugins: {
            title: {
                display: true,
                text: 'Users By Roles',
                font: {
                    size: 10
                }
            },
            legend: {
                display: true,
                position: 'bottom',
                labels :{
                    font:{
                        size: 8
                    }
                }
            }
        }
    };

    return (
        <div className="main-div">
            <div className="title">
                Users
                <Form type='user' />
            </div>
            {users.length!==0 &&(
                <>
            <div className="info">
                <InfoCard data={users} type='user' />
                <StatCard title="Users statistics:" 
                body={[{label:'Total users:', data:users.length},
                {label:'Total reservations:', data:reservations},
                {label:'Avg. reservations per user:', data:reservations/users.length}
                ]}/>
            </div>
            <div className="charts">
            <Chart type="pie" data={chartData} options={chartOptions} />
            <Chart type="pie" data={statusData} options={chartOptions} />
            </div></>)}
            
        </div>
    );
};

export default UsersPage;
