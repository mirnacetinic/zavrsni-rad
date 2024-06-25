import {getLocations, getUsers } from "@/app/actions/getInfo";
import { getDashAccommodation} from "@/app/actions/getDashInfo"
import { FaEye } from "react-icons/fa";
import InfoCard from "@/app/components/cards/infocard";
import Form from "@/app/components/inputs/form";
import Chart from "@/app/components/cards/chart";
import Link from "next/link";

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

    const createChartData = (data: { [key: string]: number }, colors: string[]) => ({
        labels: Object.keys(data),
        datasets: [
            {
                label : "Count",
                data: Object.values(data),
                backgroundColor: colors,
            }
        ]
    });

    const cityColors = ['crimson','orchid','gold','bisque','darkblue','coral', 'darkcyan', 'magenta'];
    const typeColors = ['mediumpurple', 'lightpink', 'darkcyan', 'lightblue'];
    const statusColors = ['lightgreen', 'coral', 'crimson'];

    const cityChartData = createChartData(cityData, cityColors);
    const typeChartData = createChartData(typeData, typeColors);
    const statusChartData = createChartData(statusData, statusColors);


    return (
        <div className="main-div">
            <div className="title">
                Accommodations 
                <Form type='accommodation' users={users} locations={locations} />
                <Link href={"/dashboard/accommodations/detailed"} className="flex flex-row items-center">Detailed view <FaEye className="ml-1"/></Link>
            </div>
            {accommodations.length !== 0 && (
                <>
                    <div className="info">
                        <InfoCard data={accommodations} type='accommodation' users={users} locations={locations} />
                    </div>
                    <div className="charts">
                        <Chart type="bar" data={cityChartData} title="Accommodations by City"  showLegend={false} />
                        <Chart type="pie" data={typeChartData} title="Accommodations by Type" showLegend={true} />
                        <Chart type="pie" data={statusChartData} title="Accommodations by Status" showLegend={true}/>
                    </div>
                </>
            )}
        </div>
    );
};

export default AccommodationsPage;
