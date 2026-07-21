import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { cn } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export interface ChartProps {
  type: 'line' | 'bar' | 'doughnut';
  data: any;
  options?: any;
  className?: string;
  height?: number;
}

export function Chart({ type, data, options, className, height = 300 }: ChartProps) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#A3A3A3',
          font: { family: 'Inter', size: 12 }
        }
      },
      tooltip: {
        backgroundColor: '#1E1E1E',
        titleColor: '#FAFAFA',
        bodyColor: '#A3A3A3',
        borderColor: '#333333',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4
      }
    },
    scales: type === 'doughnut' ? undefined : {
      x: {
        grid: { color: '#262626', drawBorder: false },
        ticks: { color: '#737373', font: { family: 'Inter' } }
      },
      y: {
        grid: { color: '#262626', drawBorder: false },
        ticks: { color: '#737373', font: { family: 'Inter' } }
      }
    }
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      {type === 'line' && <Line data={data} options={mergedOptions} />}
      {type === 'bar' && <Bar data={data} options={mergedOptions} />}
      {type === 'doughnut' && <Doughnut data={data} options={mergedOptions} />}
    </div>
  );
}
