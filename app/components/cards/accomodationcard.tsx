'use client';
import { Accommodation, Location, Unit } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { MdLocationPin } from "react-icons/md";

interface AccommodationCardProps {
    data: Accommodation & Location & {units : Unit[]};
}

const AccomodationCard = ({ data }:AccommodationCardProps) => {
    const router = useRouter();
    const params = new URLSearchParams(useSearchParams());
    
    return (
        <div className="relative group overflow-hidden bg-white rounded-lg shadow-md border border-gray-200">
            <div onClick={() => router.push(`/accommodations/${data.id}?${params.toString()}`)} className="cursor-pointer">
                <div className="relative">
                    {data.imageUrl ? 
                        <img src={data.imageUrl} alt="Accommodation" className="w-full h-64 object-cover object-center" /> :
                        <img src="https://via.placeholder.com/400" alt="Placeholder" className="w-full h-64 object-cover object-center" /> 
                    }
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                    <h3 className="absolute bottom-0 left-0 px-4 py-2 text-lg font-semibold text-white">
                        {data.type} {data.title}
                    </h3>
                </div>
                <div className="p-4">
                    <p className="text-gray-600 mb-2">{data.description}</p>
                    <div className="flex items-center mb-2 text-gray-500">
                        <MdLocationPin/>{data.city}, {data.country}
                    </div>
                   
                </div>
            </div>
        </div>
    );
};

export default AccomodationCard;
