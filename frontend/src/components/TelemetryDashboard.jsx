// src/components/mission/TelemetryDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, Activity, Radio, Thermometer, Gauge, Rocket, Calendar, Clock, MapPin, Users, Shield, Battery, Wifi } from 'lucide-react';

const TelemetryDashboard = () => {
  const [telemetryData, setTelemetryData] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [status, setStatus] = useState('connecting');
  const [missionStats, setMissionStats] = useState(null);

  const missionInfo = {
    name: "Artemis III",
    type: "Lunar Mission",
    launchDate: "2025-12-14",
    duration: "21 days",
    crew: 4,
    location: "Lunar South Pole",
    status: "In Progress",
    objectives: [
      "Human lunar landing",
      "Surface exploration",
      "Sample collection"
    ]
  };

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
        setMissionStats(message.data.missionStats);
      }
    };

    ws.onclose = () => {
      setStatus('disconnected');
    };

    return () => ws.close();
  }, []);

  const SystemStatus = ({ name, status }) => (
    <div className={`p-4 rounded-lg ${
      status === 'NOMINAL' ? 'bg-green-500/20' : 
      status === 'WARNING' ? 'bg-yellow-500/20' : 'bg-red-500/20'
    } border border-gray-700/50`}>
      <div className="flex items-center justify-between">
        <span className="text-gray-300 capitalize">{name}</span>
        <AlertCircle className={`h-4 w-4 ${
          status === 'NOMINAL' ? 'text-green-400' : 
          status === 'WARNING' ? 'text-yellow-400' : 'text-red-400'
        }`} />
      </div>
      <div className="mt-2 text-sm font-medium">{status}</div>
    </div>
  );

  const SignalMetric = ({ name, value, unit }) => (
    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
      <div className="text-gray-400 text-sm mb-1 capitalize">{name}</div>
      <div className="text-xl font-light">
        {value.toFixed(1)}
        <span className="text-sm text-gray-500 ml-1">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="pt-20 bg-[#0B1120] min-h-screen">
      {/* Mission Banner */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <div className="flex items-center space-x-3">
                <Rocket className="h-8 w-8 text-blue-400" />
                <h1 className="text-2xl font-light">{missionInfo.name}</h1>
              </div>
              <div className="mt-2 flex flex-wrap gap-4">
                <div className="flex items-center text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  {missionInfo.launchDate}
                </div>
                <div className="flex items-center text-gray-400">
                  <Clock className="w-4 h-4 mr-2" />
                  {missionInfo.duration}
                </div>
                <div className="flex items-center text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  {missionInfo.location}
                </div>
                <div className="flex items-center text-gray-400">
                  <Users className="w-4 h-4 mr-2" />
                  {missionInfo.crew} crew members
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className={`h-2 w-2 rounded-full ${
                status === 'connected' ? 'bg-green-500' : 
                status === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-gray-400 capitalize">{status}</span>
              {lastUpdate && (
                <span className="text-gray-400">
                  Updated: {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mission Stats */}
        {missionStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-gray-400 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Mission Safety
              </h3>
              <div className="text-2xl font-light">{missionStats.safety.toFixed(1)}%</div>
              <div className="mt-2 text-sm text-gray-500">Within parameters</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-gray-400 mb-2 flex items-center">
                <Battery className="w-4 h-4 mr-2" />
                Power Systems
              </h3>
              <div className="text-2xl font-light">{missionStats.powerSystems.toFixed(1)}%</div>
              <div className="mt-2 text-sm text-gray-500">Nominal capacity</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-gray-400 mb-2 flex items-center">
                <Wifi className="w-4 h-4 mr-2" />
                Communication
              </h3>
              <div className="text-2xl font-light">{missionStats.communication.toFixed(1)}%</div>
              <div className="mt-2 text-sm text-gray-500">Signal strength</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-gray-400 mb-2 flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Mission Progress
              </h3>
              <div className="text-2xl font-light">{missionStats.progress.toFixed(1)}%</div>
              <div className="mt-2 text-sm text-gray-500">On schedule</div>
            </div>
          </div>
        )}

        {/* Systems & Signals */}
        {telemetryData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-xl font-light mb-4">Critical Systems</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(telemetryData[telemetryData.length - 1].systems).map(([name, status]) => (
                  <SystemStatus key={name} name={name} status={status} />
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-xl font-light mb-4">Signal Parameters</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(telemetryData[telemetryData.length - 1].signals).map(([name, value]) => (
                  <SignalMetric 
                    key={name} 
                    name={name} 
                    value={value} 
                    unit={name === 'latency' ? 'ms' : '%'} 
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Telemetry Chart */}
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h3 className="text-xl font-light mb-6">Real-time Telemetry</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#4B5563"
                  tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()} 
                />
                <YAxis stroke="#4B5563" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem'
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
                  stroke="#10B981" 
                  name="Velocity (km/h)"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#EF4444" 
                  name="Temperature (°C)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelemetryDashboard;