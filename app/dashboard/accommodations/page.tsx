import { getDashAccommodation, getLocations, getUsers } from "@/app/actions/getInfo";
import InfoCard from "@/app/components/cards/infocard";
import Form from "@/app/components/inputs/form";
import Chart from "@/app/components/cards/chart";

const AccommodationsPage = async () => {
    const accommodations = await getDashAccommodation();
    const locations = await getLocations();
    const users = await getUsers();

    const cityData: { [key: string]: number } = {};
    const statusData: { [key: string]: number } = {
        'Active': 0,
        'Suspended': 0,
        'Inactive': 0
    };
    const typeData: { [key: string]: number } = {
        'Villa': 0,
        'House': 0,
        'Apartment': 0,
        'Room': 0
    };

    accommodations.forEach(a => {
        cityData[a.city] = (cityData[a.city] || 0) + 1;
        statusData[a.status]++;
        typeData[a.type]++;
    });

    const createChartData = (data: { [key: string]: number }, label: string, colors: string[]) => ({
        labels: Object.keys(data),
        datasets: [
            {
                label,
                data: Object.values(data),
                backgroundColor: colors,
                hoverBackgroundColor: colors
            }
        ]
    });

    const cityColors = ['#36A2EB',  '#FFCE56', '#4BC0C0', '#9966FF','#FF6384', '#FF9F40'];
    const typeColors = ['#FFCE56', '#FF6384', '#36A2EB', '#4BC0C0', '#9966FF'];
    const statusColors = ['#FF6384', '#FFCE56', '#36A2EB'];

    const cityChartData = createChartData(cityData, 'Number of Accommodations', cityColors);
    const typeChartData = createChartData(typeData, 'Type of Accommodations', typeColors);
    const statusChartData = createChartData(statusData, 'Status of Accommodations', statusColors);

    const createChartOptions = (title: string) => ({
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: title,
                font: {
                    size: 10
                }
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    font: {
                        size: 8
                    }
                }
            }
        }
    });

    return (
        <div className="main-div">
            <div className="title">
                Accommodations <Form type='accommodation' users={users} locations={locations} />
            </div>
            {accommodations.length !== 0 && (
                <>
                    <div className="info">
                        <InfoCard data={accommodations} type='accommodation' users={users} locations={locations} />
                    </div>
                    <div className="charts">
                        <Chart type="bar" data={cityChartData} options={createChartOptions('Accommodations by City')} />
                        <Chart type="pie" data={typeChartData} options={createChartOptions('Accommodations by Type')} />
                        <Chart type="pie" data={statusChartData} options={createChartOptions('Accommodations by Status')} />
                    </div>
                </>
            )}
        </div>
    );
};

export default AccommodationsPage;
