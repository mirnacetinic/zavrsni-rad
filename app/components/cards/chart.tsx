'use client';
import React from 'react';
import {
  Chart as ChartJS,
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
  Legend,
  Filler,
} from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';

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
  Legend,
  Filler
);

interface ChartProps {
  type: 'pie' | 'line' | 'bar';
  data: any;
  options?: any;
  title?: string;
  showLegend?: boolean;
}

const Chart: React.FC<ChartProps> = ({ type, data, options, title, showLegend }) => {
  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: !!title,
        text: title,
        font: {
          size: 10,
        },
      },
      legend: {
        display: showLegend,
        position: 'bottom',
        labels: {
          font: {
            size: 8,
          },
        },
      },
    },
    ...options,
  };

  const renderChart = () => {
    switch (type) {
      case 'pie':
        return <Pie data={data} options={chartOptions} />;
      case 'line':
        return <Line data={data} options={chartOptions} />;
      case 'bar':
        return <Bar data={data} options={chartOptions} />;
      default:
        return null;
    }
  };

  return (
    <div className='flex justify-center max-w-md lg:h-[40vh] h-[30vh] my-2 m-auto p-4 border shadow-lg rounded-lg bg-white'>
      {renderChart()}
    </div>
  );
};

export default Chart;
