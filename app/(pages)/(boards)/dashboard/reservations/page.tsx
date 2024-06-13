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

  const currentYear = new Date().getFullYear();

  const months = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(0, i).toLocaleString('default', { month: 'short' });
    return { month, reservations: 0, inquiries: 0, revenue: 0 };
  });

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
    const checkInMonth = checkInDate.getMonth();

    countByStatus[status]++;

    if (status === 'Active') {
      if (checkInYear === currentYear) {
        const monthData = months[checkInMonth];
        monthData.reservations++;
        monthData.revenue += price;
      }
      years[checkInYear] += price;
      totalRevenue += price;
      cityData[city] = (cityData[city] || 0) + 1;
      reservations.push(reservation);
      if (wasInquiry && checkInYear === currentYear) {
        months[checkInMonth].inquiries++;
        inquiriesToReservations++;
        inquiriesToReservationsRevenue += price;
      }
    } else if (status !== 'Canceled') {
      inquiries.push(reservation);
      if (wasInquiry && checkInYear === currentYear) {
        months[checkInMonth].inquiries++;
      }
      if (status !== 'Declined') {
        potentialRevenue += price;
      }
    } else {
      reservations.push(reservation);
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
              body={[
                { label: 'Total revenue:', data: totalRevenue + '€' },
                { label: 'Total reservations:', data: countByStatus['Active'] },
                { label: 'Realised inquiries:', data: inquiriesToReservations },
                { label: 'Revenue from realised inquiries:', data: '€' + inquiriesToReservationsRevenue }
              ]} />
          </div>
          <div className="charts">
            <Chart type="pie" data={chartData} title="Reservations by Status" showLegend={true} />
            <Chart type="line" data={reservationsLineChartData} title="Reservations by Months" showLegend={false} />
            <Chart type="line" data={revenueData} title="Revenue by Months" showLegend={false} />
            <Chart type="bar" data={yearlyRevenueData} showLegend={false} title={`Yearly Revenue from ${currentYear - 5} to ${currentYear}`} />
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
            <StatCard title="Inquiries statistics:"
              body={[
                { label: 'Potential revenue:', data: '€' + potentialRevenue },
                { label: 'Total inquiries:', data: countByStatus['Inquiry'] + countByStatus['Accepted'] + countByStatus['Declined'] },
                { label: 'Inquiries to reservations:', data: inquiriesToReservations },
              ]} />
          </div>
          <div className="charts">
            <Chart type="pie" data={inquiryChartData} showLegend={true} title="Inquiries by Status" />
            <Chart type="line" data={inquiriesLineChartData} title="Inquiries by Months" showLegend={false} />
          </div>
        </>
      )}
    </div>
  );
};

export default ReservationsPage;
