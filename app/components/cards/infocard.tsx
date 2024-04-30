import React from "react";

interface InfoCardProps {
    data: { [key: string]: string }[];
}

const InfoCard: React.FC<InfoCardProps> = ({ data }) => {
    return (
        <div>
            {data.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4">
            {Object.entries(item).map(([key, value]) => (
            <div key={key}>
            <span className="font-semibold">{key}: </span>
            <span>{value}</span>
            </div>))}
            </div>))}
        </div>);};

export default InfoCard;
