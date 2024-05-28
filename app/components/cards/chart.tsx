'use client';
import { Chart as ChartJS, ArcElement, LineElement, BarElement, PointElement, LineController, BarController, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import React from 'react';

ChartJS.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    LineController,
    BarController,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
);

interface ChartProps {
    type: 'pie' | 'line' | 'bar'; 
    data: any; 
    options?: any; 
}

const Chart: React.FC<ChartProps> = ({ type, data, options }) => {
    const renderChart = () => {
        switch (type) {
            case 'pie':
                return <Pie data={data} options={options} />;
            case 'line':
                return <Line data={data} options={options} />;
            case 'bar':
                return <Bar data={data} options={options} />;
            default:
                return null;
        }
    };

    return (
        <div className='flex justify-center max-w-md lg:h-[40vh] h-[30vh] my-2  m-auto p-4 border shadow-lg rounded-lg bg-white'>
            {renderChart()}
        </div>
    );
};

export default Chart;
