// Import necessary libraries
import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';

// Register the required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceChart = ({ storeData }) => {
  // Sample data structure you can use
  const stores = storeData.map(store => store.store.store_name);
  const salesData = storeData.map(store => store.totalSales);
  const revenueData = storeData.map(store => store.revenue);

  // Bar chart data (for sales)
  const salesChartData = {
    labels: stores,
    datasets: [
      {
        label: 'Total Sales',
        data: salesData,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Line chart data (for revenue)
  const revenueChartData = {
    labels: stores,
    datasets: [
      {
        label: 'Revenue',
        data: revenueData,
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Store Performance Statistics',
      },
    },
  };

  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      <h2>Business Performance</h2>
      
      {/* Sales (Bar Chart) */}
      <div style={{ marginBottom: '50px' }}>
        <h3>Total Sales by Store</h3>
        <Bar data={salesChartData} options={options} />
      </div>

      {/* Revenue (Line Chart) */}
      <div>
        <h3>Revenue by Store</h3>
        <Line data={revenueChartData} options={options} />
      </div>
    </div>
  );
};

export default PerformanceChart;
