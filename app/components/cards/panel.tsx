'use client';
import React, { useState } from "react";
import InfoCard from "./infocard";
import { useRouter } from "next/navigation";
import Form from "../inputs/form";
import { SafeUser } from "@/app/dashboard/page";

export interface PanelOption {
    label: string;
    data: any[]; 
    users? : SafeUser[],
}

interface PanelProps {
    options: PanelOption[];
}

const Panel: React.FC<PanelProps> = ({options}) => {
    const router = useRouter();
    const [selectedOption, setSelectedOption] = useState<PanelOption | null>(null);
    const [showForm, setShowForm] = useState(false);


    const handleOptionClick = (selected: PanelOption) => {
        setSelectedOption(selected);
    };

    const handleShowForm = () => {
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false); 
    };

    return (
        <div className="flex">
            <div className="w-1/4 p-4 border-r border-gray-300">
                {options.map((option) => (
                    <div key={option.label} 
                        className="mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-lg" 
                        onClick={() => handleOptionClick(option)}>
                        {option.label}
                        <div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-3/4 p-4">
                {selectedOption ? (
                    <div>
                        <div className="text-lg font-bold mb-4">{selectedOption.label}
                            <button onClick={handleShowForm} className="ml-6 px-2 py-2 bg-purple-800 text-white rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-600">
                                Add {selectedOption.label}
                            </button>
                        </div>
                       <div>
                            <InfoCard data={selectedOption.data}/>
                        </div>
                    </div>
                ) : 
                (
                    <div></div>
                )}
            </div>
            {showForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-70 z-50">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-lg">
                    {selectedOption && (
                            <Form type={selectedOption.label}
                                locations={selectedOption.label === 'Accommodations' ? options.find(option => option.label === 'Locations')?.data : []}
                                users={selectedOption.label === 'Accommodations' ? options.find(option => option.label === 'Users')?.data : []}
                                onClose={handleCloseForm} />)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Panel;
