import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; 

const AnalyticsModal = ({ alias, data, loading, error, onClose }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null); 

  useEffect(() => {
    if (!loading && data && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy(); 
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.clicksByDate.map(item => item.date),
          datasets: [{
            label: 'Total Clicks by Date',
            data: data.clicksByDate.map(item => item.totalClicks),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }


    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [loading, data]); 

  if (!alias) return null; 

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-3xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Analytics for: <span className="text-blue-600">{alias}</span></h2>
        {loading && <p className="text-center text-gray-700">Loading analytics...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}
        {data && (
          <div className="space-y-6">
            <p className="text-lg"><strong>Total Clicks:</strong> {data.totalClicks}</p>
            <p className="text-lg"><strong>Unique Clicks:</strong> {data.uniqueClicks}</p>

            <h4 className="text-xl font-semibold text-gray-800">Clicks by Date (Last 7 Days)</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <canvas ref={chartRef}></canvas> {}
            </div>

            <h4 className="text-xl font-semibold text-gray-800">OS Types</h4>
            <ul className="list-disc list-inside space-y-1">
              {data.osType.map((os, index) => (
                <li key={os.osName || index} className="text-gray-700">{os.osName}: <span className="font-semibold">{os.uniqueClicks} unique clicks</span></li>
              ))}
            </ul>

            <h4 className="text-xl font-semibold text-gray-800">Device Types</h4>
            <ul className="list-disc list-inside space-y-1">
              {data.deviceType.map((device, index) => (
                <li key={device.deviceName || index} className="text-gray-700">{device.deviceName}: <span className="font-semibold">{device.uniqueClicks} unique clicks</span></li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsModal;
