import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface InfoCardProps {
    data: { [key: string]: string }[];
    type: string;
}

const InfoCard =({ data, type }: InfoCardProps) => {
    const router = useRouter();
    const deleteInstance = async (id: string) => {
        let route = '';
    
        switch(type) {
            case 'Amenities':
                route = '/api/amenity';
                break; 
            case 'Locations':
                route = '/api/location';
                break; 
            case 'Accommodations':
                route ='/api/accommodation';
                break;
            case 'Users':
                route = '';
                break;
            case 'Reservations':
                route = 'api/reservation';
                break;
            case 'Units':
                route = 'api/unit';
                break;
        }
    
        try {
            const response = await fetch(route, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id }),
            });
    
            if (response.ok) {
                toast.success(type + " instance deleted");
                router.refresh();
            } else {
                toast.error(response.headers.get('message'));
            }
        } catch (error:any) {
            toast.error('Error deleting instance of :' + type, error.message);
        }
    };
    
    return (
        <div>
            {data.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4">
                    {Object.entries(item).map(([key, value]) => (
                        <div key={key}>
                            <span className="font-semibold">{key}: </span>
                            <span>{value}</span>
                        </div>
                    ))}
                    <button className="mr-1 px-1 py-1 bg-purple-800 text-white rounded hover:bg-gray-300 focus:outline-none focus:bg-gray-600">Edit</button>
                    <button onClick={() => deleteInstance(item['id'])} className="px-1 py-1 bg-purple-800 text-white rounded hover:bg-gray-300 focus:outline-none focus:bg-gray-600">Delete</button>
                </div>
            ))}
        </div>
    );
};

export default InfoCard;
