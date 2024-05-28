import { getReservations, getUsers } from "@/app/actions/getInfo";
import InfoCard from "@/app/components/cards/infocard";
import Form from "@/app/components/inputs/form";
import Chart from "@/app/components/cards/chart";
import StatCard from "@/app/components/cards/statcard";

const ReservationsPage = async () => {
    const reservations = await getReservations();
    const users = await getUsers();
    let totalRevenue = 0;

    const months: { [key: string]: { checkIn: number; checkOut: number , revenue : number} } = {
        Jan: { checkIn: 0, checkOut: 0, revenue: 0 }, Feb: { checkIn: 0, checkOut: 0, revenue: 0 },
        Mar: { checkIn: 0, checkOut: 0, revenue: 0 }, Apr: { checkIn: 0, checkOut: 0, revenue: 0 },
        May: { checkIn: 0, checkOut: 0, revenue: 0 }, Jun: { checkIn: 0, checkOut: 0, revenue: 0 },
        Jul: { checkIn: 0, checkOut: 0, revenue: 0 }, Aug: { checkIn: 0, checkOut: 0, revenue: 0 },
        Sep: { checkIn: 0, checkOut: 0, revenue: 0 }, Oct: { checkIn: 0, checkOut: 0, revenue: 0 },
        Nov: { checkIn: 0, checkOut: 0, revenue: 0 }, Dec: { checkIn: 0, checkOut: 0, revenue: 0 }
    };

    const countByStatus = { Active: 0, Finished: 0, Canceled: 0 };

    reservations.forEach(({ status, checkIn, checkOut, price }) => {
        countByStatus[status]++;
        const checkInMonth = checkIn.split(' ')[1];
        const checkOutMonth = checkOut.split(' ')[1];
        months[checkInMonth].checkIn++;
        months[checkOutMonth].checkOut++;
        if (status !== 'Canceled') {
            months[checkInMonth].revenue += price;
            totalRevenue+=price;
        }
    });

    const chartData = {
        labels: ['Active', 'Canceled', 'Finished'],
        datasets: [{
            label: 'Count',
            data: [countByStatus.Active, countByStatus.Canceled, countByStatus.Finished],
            backgroundColor: ['lightgreen', 'pink', 'grey'],
            hoverBackgroundColor: ['green', 'red', '#FFCE56']
        }]
    };

    const lineChartData = {
        labels: Object.keys(months),
        datasets: [
            {
                label: 'Check-Ins',
                data: Object.values(months).map(({ checkIn }) => checkIn),
                fill: false,
                borderColor: 'blue',
            },
            {
                label: 'Check-Outs',
                data: Object.values(months).map(({ checkOut }) => checkOut),
                fill: false,
                borderColor: 'red',
            }
        ]
    };

    const revenueData = {
        labels: Object.keys(months),
        datasets: [
            {
                label: 'Monthly Revenue',
                data: Object.values(months).map(({ revenue }) => revenue),
                borderColor: 'purple',
                fill: true,
                backgroundColor: 'pink'
              
            }
        ]
    };

    const chartOptions = {
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Status',
                font: { size: 10 }
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: { font: { size: 8 } }
            }
        }
    };

    const chartOptionsLine = {
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Check-In and Check-Out by Months',
                font: { size: 10 }
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: { font: { size: 8 } }
            }
        }
    };

    const revenueOptions = {
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Revenue by Months',
                font: { size: 10 }
            },
            legend:{
                display : false,
            }
           
        }
    };

    return (
        <div className="main-div">
            <div className="title">
                Reservations
                <Form type='reservation' users={users} />
            </div>
            {reservations.length !== 0 && (
                <>
            <div className="info">
                <InfoCard data={reservations} type='reservation' users={users} />
                <StatCard title="Reservations statistics:" 
                body={[{label:'Total revenue:', data:totalRevenue+'€'},
                {label:'Total reservations:', data:countByStatus['Active']},
                ]}/>
            </div>
            <div className="charts">
                <Chart type="pie" data={chartData} options={chartOptions} />
                <Chart type="line" data={revenueData} options={revenueOptions} />
                <Chart type="line" data={lineChartData} options={chartOptionsLine} />
            </div></>)}
        </div>
    );
};

export default ReservationsPage;
