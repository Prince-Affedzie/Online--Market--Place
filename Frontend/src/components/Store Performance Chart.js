import {
    Chart as ChartJS,
    CategoryScale, // Register the category scale
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales Overview',
        data: [1200, 1900, 3000, 2500, 2800, 3500],
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
        borderColor: '#2196f3',
        borderWidth: 2,
      },
    ],
  };
