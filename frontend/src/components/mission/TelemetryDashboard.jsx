import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, Activity, Battery, Radio, Thermometer, Gauge } from 'lucide-react';

const TelemetryDashboard = () => {
  const [telemetryData, setTelemetryData] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [status, setStatus] = useState('connecting');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5000');
    
    ws.onopen = () => {
      setStatus('connected');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'TELEMETRY_UPDATE') {
        setTelemetryData(prev => [...prev.slice(-30), message.data]);
        setLastUpdate(new Date());
      }
    };

    ws.onclose = () => {
      setStatus('disconnected');
    };

    return () => ws.close();
  }, []);

  const StatusIndicator = ({ status, systems }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Object.entries(systems).map(([system, status]) => (
        <div key={system} className={`p-4 rounded-lg ${
          status === 'NOMINAL' ? 'bg-green-500/20' : 
          status === 'WARNING' ? 'bg-yellow-500/20' : 'bg-red-500/20'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-gray-300 capitalize">{system}</span>
            <AlertCircle className={`h-5 w-5 ${
              status === 'NOMINAL' ? 'text-green-400' : 
              status === 'WARNING' ? 'text-yellow-400' : 'text-red-400'
            }`} />
          </div>
          <div className="mt-2 text-lg font-bold">{status}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 bg-gray-900">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Mission Telemetry</h2>
        <div className="flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${
            status === 'connected' ? 'bg-green-500' : 
            status === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
          }`} />
          <span className="text-gray-400 capitalize">{status}</span>
          {lastUpdate && (
            <span className="text-gray-400">
              Last update: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {telemetryData.length > 0 && (
          <>
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Critical Systems</h3>
              <StatusIndicator systems={telemetryData[telemetryData.length - 1].systems} />
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Signal Status</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(telemetryData[telemetryData.length - 1].signals).map(([key, value]) => (
                  <div key={key} className="bg-gray-700 rounded-lg p-4">
                    <div className="text-gray-400 mb-2 capitalize">{key}</div>
                    <div className="text-2xl font-bold">
                      {value.toFixed(1)}
                      <span className="text-sm text-gray-400 ml-1">
                        {key === 'latency' ? 'ms' : '%'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Real-time Metrics</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={telemetryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="timestamp" 
                stroke="#9CA3AF"
                tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()} 
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6'
                }}
                labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
              />
              <Line 
                type="monotone" 
                dataKey="altitude" 
                stroke="#3B82F6" 
                name="Altitude (km)"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="velocity" 
                stroke="#EF4444" 
                name="Velocity (km/h)"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#10B981" 
                name="Temperature (°C)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TelemetryDashboard;