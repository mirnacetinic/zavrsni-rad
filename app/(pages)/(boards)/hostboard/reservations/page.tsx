import { getBoardReservations} from "@/app/actions/getDashInfo";
import InfoCard from "@/app/components/cards/infocard";
import '../../dashboard/style.css';
import StatCard from "@/app/components/cards/statcard";
import getUser from "@/app/actions/getUser";
import Chart from "@/app/components/cards/chart";

const ReservationsPage = async () =>{
    const user = await getUser();
    if(!user) return;
    const reservationsAll = await getBoardReservations(user.id);
    const inquiries: any[] = [];
    const reservations: any[] = [];
    let totalRevenue = 0;
    let potentialRevenue = 0;
    let inquiriesToReservations = 0;
    let inquiriesToReservationsRevenue = 0;

    const countByStatus = { Active: 0, Inquiry: 0, Declined: 0, Accepted: 0, Canceled: 0 };

    reservationsAll.forEach((reservation) => {
        const { wasInquiry, ...data } = reservation;
        countByStatus[data.status]++;

        if (data.status === 'Active') {
            totalRevenue += data.revenue;
            reservations.push(data);
            if (wasInquiry) {
                inquiriesToReservations++;
                inquiriesToReservationsRevenue += data.revenue;
            }
        } else if (data.status !== 'Canceled') {
            inquiries.push(data);
            if (data.status !== 'Declined') potentialRevenue += data.revenue;
        }
        else{
            reservations.push(data);
        }
    });

    const chartData = {
        labels: ["Active", "Canceled"],
        datasets: [{
                data: [countByStatus.Active, countByStatus.Canceled],
                backgroundColor: ['mediumseagreen', 'indianred'],
        }]
    };

    const inquiryChartData = {
        labels: ['Inquiry', 'Accepted', 'Declined', 'Inquiries to Reservations'],
        datasets: [{
            data: [countByStatus.Inquiry, countByStatus.Accepted, countByStatus.Declined, inquiriesToReservations],
            backgroundColor: ['coral', 'mediumseagreen', 'indianred', 'lightblue'],
        }]
    };

    return(
    <div className="main-div">
        <div className="title">
            Reservations
        </div>
        {reservations.length>0 && (
        <>
            <div className="info">
                <InfoCard data={reservations} type='host' />
            </div>
            <div className="charts">
                <StatCard title="Reservations statistics:"
                    body={[
                        { label: 'Total revenue:', data: totalRevenue + '€' },
                        { label: 'Total reservations:', data: countByStatus['Active'] },
                        { label: 'Realised inquiries:', data: inquiriesToReservations },
                        { label: 'Revenue from realised inquiries:', data: '€' + inquiriesToReservationsRevenue }]} />
                <Chart type="pie" data={chartData} title="Reservations by Status" showLegend={true} />
            </div>
        </> )}

        {inquiries.length>0 && (
        <>
            <div className="info">
                <InfoCard data={inquiries} type='host' />
            </div>
            <div className="charts">
                <StatCard title="Inquiries statistics:"
                    body={[
                        { label: 'Potential revenue:', data: '€' + potentialRevenue },
                        { label: 'Total inquiries:', data: countByStatus['Inquiry'] + countByStatus['Accepted'] + countByStatus['Declined'] },
                        { label: 'Inquiries to reservations:', data: inquiriesToReservations },]} />
                <Chart type="pie" data={inquiryChartData} showLegend={true} title="Inquiries by Status" />
            </div>
        </> )}
    </div>
)}

export default ReservationsPage;