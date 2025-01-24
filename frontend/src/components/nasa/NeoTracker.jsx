import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, Target, Ruler } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const NeoTracker = () => {
  const [neoData, setNeoData] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNeoData();
  }, [dateRange]);

  const fetchNeoData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/nasa/neo?start_date=${dateRange.start}&end_date=${dateRange.end}`
      );
      setNeoData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching NEO data');
      setLoading(false);
    }
  };

  const prepareChartData = () => {
    if (!neoData) return [];
    
    return Object.entries(neoData.near_earth_objects).map(([date, objects]) => ({
      date,
      total: objects.length,
      hazardous: objects.filter(obj => obj.is_potentially_hazardous_asteroid).length,
      averageSize: objects.reduce((acc, obj) => 
        acc + (obj.estimated_diameter.kilometers.estimated_diameter_max + 
               obj.estimated_diameter.kilometers.estimated_diameter_min) / 2, 0) / objects.length
    }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Date Selection */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl text-white font-bold mb-4">Near Earth Objects Tracker</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded p-2"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded p-2"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">{error}</div>
      ) : neoData && (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Target className="h-8 w-8 text-blue-400 mr-3" />
                <h3 className="text-xl text-white">Total Objects</h3>
              </div>
              <p className="text-3xl text-white">{neoData.element_count}</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-8 w-8 text-yellow-400 mr-3" />
                <h3 className="text-xl text-white">Potentially Hazardous</h3>
              </div>
              <p className="text-3xl text-white">
                {Object.values(neoData.near_earth_objects)
                  .flat()
                  .filter(neo => neo.is_potentially_hazardous_asteroid)
                  .length}
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Ruler className="h-8 w-8 text-green-400 mr-3" />
                <h3 className="text-xl text-white">Average Size</h3>
              </div>
              <p className="text-3xl text-white">
                {(Object.values(neoData.near_earth_objects)
                  .flat()
                  .reduce((acc, neo) => 
                    acc + (neo.estimated_diameter.kilometers.estimated_diameter_max +
                          neo.estimated_diameter.kilometers.estimated_diameter_min) / 2, 0) /
                  neoData.element_count
                ).toFixed(2)} km
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl text-white mb-4">Activity Overview</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prepareChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: '#F3F4F6'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#3B82F6"
                    name="Total Objects"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="hazardous"
                    stroke="#EF4444"
                    name="Hazardous Objects"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="averageSize"
                    stroke="#10B981"
                    name="Average Size (km)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NeoTracker;