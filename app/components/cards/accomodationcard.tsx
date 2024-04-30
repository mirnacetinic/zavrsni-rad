'use client';
import { Accomodation, Location, Amenity } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";

interface AccomodationCardProps {
    key : number,
    data: Accomodation & Location & { amenities: Amenity[] };
}

const AccomodationCard: React.FC<AccomodationCardProps> = ({data}) => {
    const router = useRouter();
    return (
        <div onClick={()=>router.push(`accomodations/${data.id}`)} className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="relative">
                <img src="https://via.placeholder.com/400" alt="Object" className="h-48 w-full object-cover object-center" />
                <div className="px-4 top-0 bottom-0 bg-black opacity-50">
                    <h3 className="text-lg font-semibold text-white top-4 left-4">
                        {data.type} {data.title}
                    </h3>
                </div>
    
            </div>
            <div className="p-4">
                <p className="text-gray-600 mb-2">{data.description}</p>
                <div className="flex items-center mb-4">
                    <span className="text-gray-500">{data.city}, {data.country}</span>
                </div>
                <div className="flex items-center">
                    <div className="ml-4">
                        <h4 className="font-semibold mb-2">Amenities</h4>
                        <ul className="list-disc list-inside">
                            {data.amenities.map((amenity, index) => (
                                <li key={index}>{amenity.name} - €{amenity.price}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccomodationCard;
