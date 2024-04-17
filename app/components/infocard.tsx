'use client'
import React from "react";

interface InfoCardProps {
    data: any [];
}

const InfoCard: React.FC<InfoCardProps> = ({ data }) => {
    return (
        <div className="border rounded-lg p-4 mb-4">
            {Object.entries(data).map(([key, value]) => (
                <div key={key} className="mb-2">
                    <span className="font-semibold">{key}: </span>
                    <span>{JSON.stringify(value)}</span>
                </div>
            ))}
        </div>
    );
};

export default InfoCard;
