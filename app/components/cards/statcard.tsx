interface StatCardProps {
    title?: string;
    body: { label: string, data: any }[];
}

const StatCard = ({ title, body }: StatCardProps) => {
    return (
        <div className="flex flex-col justify-center items-center w-fit h-auto my-4 mx-auto p-6 border border-gray-200 rounded-lg shadow-lg bg-white">
            {title && <div className="text-lg font-semibold text-gray-800 mb-4">{title}</div>}
            <div className="text-gray-700 border border-lg shadow-lg rounded p-2">
                {body.map((item, index) => (
                    <div key={index} className="text-sm m-2">
                        <span className="font-semibold">{item.label}</span> {item.data}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StatCard;
