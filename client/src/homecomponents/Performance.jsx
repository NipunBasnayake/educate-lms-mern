import React from 'react';
import Chart from 'react-apexcharts';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const trendData = [
  { month: 'Jan', value: 65 },
  { month: 'Feb', value: 72 },
  { month: 'Mar', value: 80 },
  { month: 'Apr', value: 85 },
  { month: 'May', value: 88 },
  { month: 'Jun', value: 92 },
];

const RadialChart = ({ label, value, color = '#6366F1' }) => {
  const chartOptions = {
    chart: {
      type: 'radialBar',
      sparkline: { enabled: false },
    },
    plotOptions: {
      radialBar: {
        hollow: { size: '65%' },
        track: { background: '#F1F5F9' },
        dataLabels: {
          name: {
            offsetY: -10,
            color: '#64748B',
            fontSize: '14px',
            fontWeight: 500,
          },
          value: {
            offsetY: 5,
            fontSize: '24px',
            fontWeight: 700,
            color: '#0F172A',
            formatter: function(val) {
              return val + '%';
            }
          },
        },
      },
    },
    stroke: {
      lineCap: 'round'
    },
    fill: { 
      colors: [color],
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: [color],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.8,
        stops: [0, 100]
      }
    },
    labels: [label],
  };

  return (
    <div className="w-full h-full">
      <Chart 
        options={chartOptions} 
        series={[value]} 
        type="radialBar" 
        height={160}
      />
    </div>
  );
};

const Performance = () => {
  return (
    <div className="flex flex-col">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Performance Summary</h3>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
            Current Term
          </span>
        </div>

        {/* Grade Highlight */}
        <div className="p-4 bg-gradient-to-r from-gray-100  to-gray-90  rounded-xl flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500">Top Performance</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">A+</p>
            <p className="text-xs text-gray-500 mt-1">Capstone Project • May 2024</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Radial Charts Section (Now includes Course Progress) */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center justify-center">
            <RadialChart label="Overall" value={92} color="#6366F1" />
            <p className="text-sm font-medium text-gray-700 mt-2">Overall Performance</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <RadialChart label="Assessments" value={89} color="#3B82F6" />
            <p className="text-sm font-medium text-gray-700 mt-2">Assessment Score</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <RadialChart label="Exams" value={95} color="#10B981" />
            <p className="text-sm font-medium text-gray-700 mt-2">Exam Score</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <RadialChart label="Progress" value={92} color="#F59E0B" />
            <p className="text-sm font-medium text-gray-700 mt-2">Course Progress</p>
          </div>
        </div>

        {/* Line Chart - Performance Trend */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700">Performance Trend</p>
            <div className="flex space-x-2">
              <button className="text-xs px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                Weekly
              </button>
              <button className="text-xs px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                Monthly
              </button>
            </div>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748B" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748B" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                  domain={[50, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px',
                    padding: '8px 12px'
                  }}
                  labelStyle={{ 
                    color: '#334155',
                    fontWeight: 600,
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#475569' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={{ 
                    r: 4,
                    stroke: '#6366F1',
                    strokeWidth: 2,
                    fill: '#fff'
                  }}
                  activeDot={{ 
                    r: 6,
                    stroke: '#6366F1',
                    strokeWidth: 2,
                    fill: '#fff'
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;
