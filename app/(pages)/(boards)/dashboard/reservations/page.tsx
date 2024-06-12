import { getDashReservations } from "@/app/actions/getDashInfo";
import InfoCard from "@/app/components/cards/infocard";
import Form from "@/app/components/inputs/form";
import Chart from "@/app/components/cards/chart";
import StatCard from "@/app/components/cards/statcard";
import { getUsers } from "@/app/actions/getInfo";

const ReservationsPage = async () => {
    const reservationsAll = await getDashReservations();
    const users = await getUsers();

    const inquiries: any[] = [];
    const reservations: any[] = [];
    let totalRevenue = 0;
    let potentialRevenue = 0;
    let inquiriesToReservations = 0;
    let inquiriesToReservationsRevenue = 0;

    const months = Array.from({ length: 12 }, (_, i) => {
        const month = new Date(0, i).toLocaleString('default', { month: 'short' });
        return { month, reservations: 0, inquiries: 0, revenue: 0 };
    });

    const currentYear = new Date().getFullYear();
    const years: { [key: number]: number } = {};
    for (let i = 0; i < 6; i++) {
        years[currentYear - i] = 0;
    }

    const countByStatus = { Active: 0, Inquiry: 0, Declined: 0, Accepted: 0, Canceled: 0 };
    const cityData: { [key: string]: number } = {};

    reservationsAll.forEach((reservation) => {
        const { status, checkIn, price, wasInquiry, city } = reservation;
        const checkInDate = new Date(checkIn);
        const checkInYear = checkInDate.getFullYear();

        countByStatus[status]++;

        if (status === 'Active') {
            const monthData = months[checkInDate.getMonth()];
            monthData.reservations++;
            monthData.revenue += price;
            totalRevenue += price;
            cityData[city]++;
            reservations.push(reservation);
            if (wasInquiry) {
                monthData.inquiries++;
                inquiriesToReservations++;
                inquiriesToReservationsRevenue += price;
            }
        } else if (status !== 'Canceled') {
            inquiries.push(reservation);
            if (wasInquiry) months[checkInDate.getMonth()].inquiries++;
            if (status !== 'Declined') potentialRevenue += price;
        }
        else{

        reservations.push(reservation);
    }


        if (years.hasOwnProperty(checkInYear)) {
            years[checkInYear] += price;
        }
    });

    const chartData = {
        labels: ["Active", "Canceled"],
        datasets: [
            {
                data: [countByStatus.Active, countByStatus.Canceled],
                backgroundColor: ['mediumseagreen', 'indianred'],
            }
        ]
    };

    const inquiryChartData = {
        labels: ['Inquiry', 'Accepted', 'Declined', 'Inquiries to Reservations'],
        datasets: [{
            data: [countByStatus.Inquiry, countByStatus.Accepted, countByStatus.Declined, inquiriesToReservations],
            backgroundColor: ['coral', 'mediumseagreen', 'indianred', 'lightblue'],
        }]
    };

    const reservationsLineChartData = {
        labels: months.map(({ month }) => month),
        datasets: [
            {
                label: 'Reservations',
                data: months.map(({ reservations }) => reservations),
                fill: false,
                borderColor: 'blue',
            }
        ]
    };

    const inquiriesLineChartData = {
        labels: months.map(({ month }) => month),
        datasets: [
            {
                label: 'Inquiries by Month',
                data: months.map(({ inquiries }) => inquiries),
                fill: false,
                borderColor: 'orange',
            }
        ]
    };

    const revenueData = {
        labels: months.map(({ month }) => month),
        datasets: [
            {
                label: 'Monthly Revenue',
                data: months.map(({ revenue }) => revenue),
                borderColor: 'purple',
                fill: true,
                backgroundColor: 'pink'
            }
        ]
    };

    const yearlyRevenueData = {
        labels: Object.keys(years),
        datasets: [
            {
                label: 'Yearly Revenue',
                data: Object.values(years),
                backgroundColor: 'lightblue',
                borderColor: 'blue',
                borderWidth: 1,
            }
        ]
    };

    
    const lineChartOptions = {
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Reservations by Month',
                font: { size: 10 }
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: { font: { size: 8 } }
            }
        }
    };

    const lineChartOptionsI = {
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Inquiries by Month',
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
                text: 'Revenue by Month',
                font: { size: 10 }
            },
            legend: {
                display: false,
            }
        }
    };

    const yearlyRevenueOptions = {
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: `Yearly Revenue from ${currentYear - 5} to ${currentYear}`,
                font: { size: 10 }
            },
            legend: {
                display: false,
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
                    </div>
                    <div className="charts">
                        <StatCard title="Reservations statistics:"
                            body={[
                                { label: 'Total revenue:', data: totalRevenue + '€' },
                                { label: 'Total reservations:', data: countByStatus['Active'] },
                                { label: 'Realised inquiries:', data: inquiriesToReservations },
                                { label: 'Revenue from realised inquiries:', data: '€' + inquiriesToReservationsRevenue }
                            ]} />
                        <Chart type="pie" data={chartData} showLegend={true} title="Reservations by Status" />
                        <Chart type="line" data={reservationsLineChartData} options={lineChartOptions} />
                        <Chart type="line" data={revenueData} options={revenueOptions} />
                        <Chart type="bar" data={yearlyRevenueData} options={yearlyRevenueOptions} />
                    </div>
                </>
            )}
            {inquiries.length !== 0 && (
                <>
                    <div className="title">
                        Inquiries
                    </div>
                    <div className="info">
                        <InfoCard data={inquiries} type='reservation' users={users} />
                    </div>
                    <div className="charts">
                        <StatCard title="Inquiries statistics:"
                            body={[
                                { label: 'Potential revenue:', data: '€' + potentialRevenue },
                                { label: 'Total inquiries:', data: countByStatus['Inquiry'] + countByStatus['Accepted'] + countByStatus['Declined'] },
                                { label: 'Inquiries to reservations:', data: inquiriesToReservations },
                            ]} />
                        <Chart type="pie" data={inquiryChartData} showLegend={true} title="Inquiries by Status" />
                        <Chart type="line" data={inquiriesLineChartData} options={lineChartOptionsI} />
                    </div>
                </>
            )}
        </div>
    );
};

export default ReservationsPage;
