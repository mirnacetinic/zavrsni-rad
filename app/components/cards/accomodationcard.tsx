'use client';
import { SearchAccommodation } from "@/app/types/type";
import { useRouter, useSearchParams } from "next/navigation";
import { MdLocationPin } from "react-icons/md";

interface AccommodationCardProps {
    data: SearchAccommodation;
}

const AccomodationCard = ({ data }: AccommodationCardProps) => {
    const router = useRouter();
    const params = useSearchParams();
    
    return (
        <div className="overflow-hidden bg-white rounded-lg shadow-md border border-gray-200">
            <div onClick={() => router.push(`/accommodations/${data.id}?${params.toString()}`)} className="cursor-pointer">
                <div className="relative">
                    {data.imageUrl ? 
                        <img src={data.imageUrl} alt="Accommodation" className="z-0 w-full h-64 object-cover object-center" /> :
                        <img src="https://via.placeholder.com/400" alt="Placeholder" className="z-0 w-full h-64 object-cover object-center" /> 
                    }
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                    <h3 className="absolute bottom-0 left-0 px-4 py-2 text-lg font-semibold text-white">
                        {data.type} {data.title}
                    </h3>
                </div>
                <div className="p-4">
                    <p className="text-gray-600 mb-2">{data.description}</p>
                    <div className="flex items-center mb-2 text-gray-500">
                        <MdLocationPin/>{data.address} - {data.city}, {data.country}
                    </div>
                    <div className="flex flex-col text-gray-600 m-1">
                        {data.price>0 && (<p>Average price :  €{data.price}</p>)}   
                        {data.rating>0 && (<p>Average rating : {data.rating}</p>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccomodationCard;
