'use client';
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface InfoCardProps<T> {
    data: T[];
    type: string;
}

const InfoCard = <T extends { id: number }>({ data, type }: InfoCardProps<T>) => {
    const router = useRouter();
    const deleteInstance = async (id: number) => {
    let route = `/api/${type}`
    if(type==='user'){
        route = '/api/register';
            
    }
        try {
            const response = await fetch(route, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                toast.success(`Deleted ${type} successfully`);
                router.refresh();
            } else {
                toast.error(response.headers.get('message') || 'Error deleting instance');
            }
        } catch (error: any) {
            toast.error(`Error deleting ${type}`, error.message);
        }
    };

    return (
        <div className="w-full">
            <table className="w-full  border rounded border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        {Object.keys(data[0]).map((key) => (
                            <th key={key} className="border border-gray-200 p-2">{key.toUpperCase()}</th>
                        ))}
                        <th className="border border-gray-200 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            {Object.values(item).map((value, index) => (
                                <td key={index} className="border border-gray-200 p-2">{value}</td>
                            ))}
                            <td className="flex justify-center border border-gray-200 p-2">
                                <button className="form_button mr-2">Edit</button>
                                <button onClick={() => deleteInstance(item.id)} className="form_button">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InfoCard;
