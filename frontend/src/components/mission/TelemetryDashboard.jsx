import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  AlertCircle,
  Activity,
  Battery,
  Radio,
  Thermometer,
  Gauge,
  Rocket,
  Calendar,
  Clock,
  MapPin,
  Users,
  Shield,
  Wifi,
  Bell,
  Download,
  Zap,
  Server,
  Cpu,
  Droplet,
  Wind,
  LifeBuoy,
  Flame,
  Compass,
} from "lucide-react";

const TelemetryDashboard = () => {
  const [telemetryData, setTelemetryData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [systemAlerts, setSystemAlerts] = useState([]);

  // Mission information
  const missionInfo = {
    name: "Artemis III",
    type: "Lunar Mission",
    launchDate: "2025-12-14",
    duration: "21 days",
    crew: 4,
    location: "Lunar South Pole",
    status: "In Progress",
    missionDay: 8,
    objectives: [
      "Human lunar landing",
      "Surface exploration",
      "Sample collection",
      "Resource utilization experiment",
      "Long-duration habitat testing",
    ],
  };

  // Generate sample telemetry data for demonstration
  useEffect(() => {
    // Simulated connection with server
    const connectToServer = () => {
      setConnectionStatus("connecting");

      // Simulate connection delay
      setTimeout(() => {
        setConnectionStatus("connected");
        const interval = startTelemetryStream();
        return () => clearInterval(interval);
      }, 1500);
    };

    // Generate historical data first
    const generateHistoricalData = () => {
      const data = [];
      const now = Date.now();

      // Generate 24 hours of past data with 30-minute intervals
      for (let i = 48; i >= 0; i--) {
        const timestamp = now - i * 30 * 60 * 1000;
        data.push({
          timestamp,
          altitude: 380 + Math.sin(i / 5) * 20 + Math.random() * 5,
          velocity: 27500 + Math.cos(i / 10) * 200 + Math.random() * 50,
          temperature: Math.sin(i / 8) * 30 + Math.random() * 5 - 10,
          radiation: 100 + Math.sin(i / 7) * 50 + Math.random() * 20,
          power: 85 + Math.sin(i / 12) * 10 + Math.random() * 5,
          oxygen: 98 + Math.sin(i / 10) * 1.5 + Math.random() * 0.5,
          water: 92 + Math.sin(i / 15) * 5 + Math.random() * 2,
          fuel: 100 - i * 0.4 + Math.random() * 0.2,
          signals: {
            strength: 95 + Math.sin(i / 6) * 4 + Math.random() * 1,
            quality: 98 + Math.sin(i / 8) * 1.5 + Math.random() * 0.5,
            latency: 50 + Math.sin(i / 4) * 30 + Math.random() * 10,
          },
          systems: {
            primary: Math.random() > 0.03 ? "NOMINAL" : "WARNING",
            backup: Math.random() > 0.01 ? "NOMINAL" : "CRITICAL",
            communication: Math.random() > 0.02 ? "NOMINAL" : "WARNING",
            lifesupport: Math.random() > 0.01 ? "NOMINAL" : "WARNING",
            navigation: Math.random() > 0.02 ? "NOMINAL" : "WARNING",
            power: Math.random() > 0.01 ? "NOMINAL" : "NOMINAL",
          },
        });
      }

      setHistoricalData(data);
    };

    const startTelemetryStream = () => {
      // Generate new data every second
      const interval = setInterval(() => {
        if (connectionStatus === "connected") {
          const latestData = generateTelemetryData();
          setTelemetryData((prev) => [...prev.slice(-60), latestData]);
          setLastUpdate(new Date());

          // Randomly generate system alerts
          if (Math.random() < 0.05) {
            const newAlert = generateSystemAlert();
            setSystemAlerts((prev) => [newAlert, ...prev].slice(0, 5));
          }
        }
      }, 1000);

      return interval;
    };

    generateHistoricalData();
    const cleanup = connectToServer();

    // Clean up
    return () => {
      if (cleanup) cleanup();
    };
  }, [connectionStatus]);

  // Generate a single telemetry data point
  const generateTelemetryData = () => {
    const now = Date.now();
    // Get the last data point or create default
    const lastData =
      telemetryData.length > 0
        ? telemetryData[telemetryData.length - 1]
        : {
            altitude: 380,
            velocity: 27500,
            temperature: 0,
            radiation: 100,
            power: 85,
            oxygen: 98,
            water: 92,
            fuel: 85,
            signals: {
              strength: 95,
              quality: 98,
              latency: 50,
            },
            systems: {
              primary: "NOMINAL",
              backup: "NOMINAL",
              communication: "NOMINAL",
              lifesupport: "NOMINAL",
              navigation: "NOMINAL",
              power: "NOMINAL",
            },
          };

    // Generate new data with slight randomness but following trends
    return {
      timestamp: now,
      altitude: lastData.altitude + (Math.random() * 2 - 1) * 0.5,
      velocity: lastData.velocity + (Math.random() * 2 - 1) * 10,
      temperature: lastData.temperature + (Math.random() * 2 - 1) * 0.3,
      radiation: lastData.radiation + (Math.random() * 2 - 1) * 2,
      power: lastData.power + (Math.random() * 2 - 1) * 0.2,
      oxygen: Math.min(
        100,
        Math.max(90, lastData.oxygen + (Math.random() * 2 - 1) * 0.1)
      ),
      water: Math.min(
        100,
        Math.max(85, lastData.water + (Math.random() * 2 - 1) * 0.05)
      ),
      fuel: Math.max(0, lastData.fuel - 0.01 - Math.random() * 0.01),
      signals: {
        strength: Math.min(
          100,
          Math.max(
            80,
            lastData.signals?.strength || 95 + (Math.random() * 2 - 1) * 0.3
          )
        ),
        quality: Math.min(
          100,
          Math.max(
            85,
            lastData.signals?.quality || 98 + (Math.random() * 2 - 1) * 0.2
          )
        ),
        latency: Math.max(
          10,
          Math.min(
            150,
            lastData.signals?.latency || 50 + (Math.random() * 2 - 1) * 3
          )
        ),
      },
      systems: {
        primary: Math.random() > 0.01 ? "NOMINAL" : "WARNING",
        backup: Math.random() > 0.005 ? "NOMINAL" : "CRITICAL",
        communication: Math.random() > 0.008 ? "NOMINAL" : "WARNING",
        lifesupport: Math.random() > 0.002 ? "NOMINAL" : "WARNING",
        navigation: Math.random() > 0.007 ? "NOMINAL" : "WARNING",
        power: Math.random() > 0.001 ? "NOMINAL" : "CRITICAL",
      },
    };
  };

  // Generate a random system alert
  const generateSystemAlert = () => {
    const alertTypes = [
      {
        type: "warning",
        message: "Radiation levels temporarily elevated",
        system: "Environment",
      },
      {
        type: "info",
        message: "Scheduled system diagnostics complete",
        system: "Maintenance",
      },
      {
        type: "critical",
        message: "Primary power fluctuation detected",
        system: "Power",
      },
      {
        type: "warning",
        message: "Communication signal quality reduced",
        system: "Comms",
      },
      {
        type: "info",
        message: "Course correction successfully applied",
        system: "Navigation",
      },
      {
        type: "warning",
        message: "Oxygen recycling efficiency decreased",
        system: "Life Support",
      },
      {
        type: "critical",
        message: "Micrometeoroid impact detected on sector 7",
        system: "Hull Integrity",
      },
    ];

    const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    return {
      id: Date.now(),
      timestamp: new Date(),
      ...alert,
    };
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "systems", label: "Systems", icon: Server },
    { id: "environment", label: "Environment", icon: Thermometer },
    { id: "comms", label: "Communications", icon: Radio },
    { id: "alerts", label: "Alerts", icon: Bell },
  ];

  // Component for a system status indicator
  const SystemStatus = ({ name, status, icon: Icon }) => (
    <div
      className={`p-4 rounded-lg ${
        status === "NOMINAL"
          ? "bg-green-500/20 border-green-500/30"
          : status === "WARNING"
          ? "bg-yellow-500/20 border-yellow-500/30"
          : "bg-red-500/20 border-red-500/30"
      } border`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-gray-300" />}
          <span className="text-gray-300 capitalize">{name}</span>
        </div>
        <AlertCircle
          className={`h-4 w-4 ${
            status === "NOMINAL"
              ? "text-green-400"
              : status === "WARNING"
              ? "text-yellow-400"
              : "text-red-400"
          }`}
        />
      </div>
      <div className="text-lg font-medium">
        <span
          className={
            status === "NOMINAL"
              ? "text-green-400"
              : status === "WARNING"
              ? "text-yellow-400"
              : "text-red-400"
          }
        >
          {status}
        </span>
      </div>
    </div>
  );

  // Component for resource gauge
  const ResourceGauge = ({
    name,
    value,
    unit,
    icon: Icon,
    color = "blue",
    lowWarning = 20,
    highWarning = 80,
  }) => {
    let gaugeColor = "";
    if (color === "blue") gaugeColor = "text-blue-400";
    if (color === "green") gaugeColor = "text-green-400";
    if (color === "purple") gaugeColor = "text-purple-400";
    if (color === "orange") gaugeColor = "text-orange-400";

    if (value < lowWarning) gaugeColor = "text-red-400";
    if (value > highWarning && highWarning < 100)
      gaugeColor = "text-yellow-400";

    let barColor = "";
    if (color === "blue") barColor = "bg-blue-500";
    if (color === "green") barColor = "bg-green-500";
    if (color === "purple") barColor = "bg-purple-500";
    if (color === "orange") barColor = "bg-orange-500";

    return (
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            {Icon && <Icon className="w-4 h-4" />}
            <span>{name}</span>
          </div>
          <span className={`text-2xl font-light ${gaugeColor}`}>
            {value.toFixed(1)}
            <span className="text-sm text-gray-500 ml-1">{unit}</span>
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${barColor}`}
            style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const getLatestData = () => {
    return telemetryData.length > 0
      ? telemetryData[telemetryData.length - 1]
      : null;
  };

  const latestData = getLatestData();

  // Map system icons to components
  const systemIcons = {
    primary: Server,
    backup: Shield,
    communication: Radio,
    lifesupport: LifeBuoy,
    navigation: Compass,
    power: Battery,
  };

  // Function to get alert icon based on type
  const getAlertIcon = (type) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case "critical":
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case "info":
        return <Bell className="w-5 h-5 text-blue-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Mission Banner */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <div className="flex items-center space-x-3">
                <Rocket className="h-8 w-8 text-blue-400" />
                <h1 className="text-2xl font-light">{missionInfo.name}</h1>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    connectionStatus === "connected"
                      ? "bg-green-500/20 text-green-400"
                      : connectionStatus === "connecting"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {connectionStatus}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-4">
                <div className="flex items-center text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  {missionInfo.launchDate}
                </div>
                <div className="flex items-center text-gray-400">
                  <Clock className="w-4 h-4 mr-2" />
                  Mission Day {missionInfo.missionDay}
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
              {lastUpdate && (
                <span className="text-gray-400 text-sm">
                  Last update: {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center px-4 py-3 border-b-2 transition-colors ${
                  selectedTab === tab.id
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {selectedTab === "overview" && (
          <div>
            {/* Mission Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 rounded-lg p-4 border border-blue-900/30">
                <h3 className="text-gray-400 text-sm mb-1 flex items-center">
                  <Gauge className="w-4 h-4 mr-1" />
                  Altitude
                </h3>
                <div className="text-2xl font-light">
                  {latestData?.altitude.toFixed(1)}{" "}
                  <span className="text-sm text-gray-500">km</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-900/30 to-green-800/10 rounded-lg p-4 border border-green-900/30">
                <h3 className="text-gray-400 text-sm mb-1 flex items-center">
                  <Zap className="w-4 h-4 mr-1" />
                  Velocity
                </h3>
                <div className="text-2xl font-light">
                  {latestData?.velocity.toFixed(0)}{" "}
                  <span className="text-sm text-gray-500">km/h</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/10 rounded-lg p-4 border border-purple-900/30">
                <h3 className="text-gray-400 text-sm mb-1 flex items-center">
                  <Battery className="w-4 h-4 mr-1" />
                  Power
                </h3>
                <div className="text-2xl font-light">
                  {latestData?.power.toFixed(1)}{" "}
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-900/30 to-red-800/10 rounded-lg p-4 border border-red-900/30">
                <h3 className="text-gray-400 text-sm mb-1 flex items-center">
                  <Thermometer className="w-4 h-4 mr-1" />
                  Temperature
                </h3>
                <div className="text-2xl font-light">
                  {latestData?.temperature.toFixed(1)}{" "}
                  <span className="text-sm text-gray-500">°C</span>
                </div>
              </div>
            </div>

            {/* Real-time charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h3 className="text-lg font-light mb-3">Altitude & Velocity</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={telemetryData.slice(-30)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                      <XAxis
                        dataKey="timestamp"
                        stroke="#4B5563"
                        tickFormatter={(timestamp) =>
                          new Date(timestamp).toLocaleTimeString()
                        }
                      />
                      <YAxis yAxisId="left" stroke="#3B82F6" />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#10B981"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111827",
                          border: "1px solid #374151",
                          borderRadius: "0.5rem",
                        }}
                        labelFormatter={(timestamp) =>
                          new Date(timestamp).toLocaleTimeString()
                        }
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="altitude"
                        stroke="#3B82F6"
                        name="Altitude (km)"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="velocity"
                        stroke="#10B981"
                        name="Velocity (km/h)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h3 className="text-lg font-light mb-3">
                  Temperature & Radiation
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={telemetryData.slice(-30)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                      <XAxis
                        dataKey="timestamp"
                        stroke="#4B5563"
                        tickFormatter={(timestamp) =>
                          new Date(timestamp).toLocaleTimeString()
                        }
                      />
                      <YAxis yAxisId="left" stroke="#EF4444" />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#F59E0B"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111827",
                          border: "1px solid #374151",
                          borderRadius: "0.5rem",
                        }}
                        labelFormatter={(timestamp) =>
                          new Date(timestamp).toLocaleTimeString()
                        }
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="temperature"
                        stroke="#EF4444"
                        name="Temperature (°C)"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="radiation"
                        stroke="#F59E0B"
                        name="Radiation (µSv/h)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Critical System Status & Resources */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-1 bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h3 className="text-lg font-light mb-3">Critical Systems</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                  {latestData &&
                    Object.entries(latestData.systems).map(
                      ([system, status]) => (
                        <SystemStatus
                          key={system}
                          name={system}
                          status={status}
                          icon={systemIcons[system] || Server}
                        />
                      )
                    )}
                </div>
              </div>

              <div className="lg:col-span-2 bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h3 className="text-lg font-light mb-3">Resources</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ResourceGauge
                    name="Power"
                    value={latestData?.power || 0}
                    unit="%"
                    icon={Battery}
                    color="purple"
                    lowWarning={20}
                  />
                  <ResourceGauge
                    name="Oxygen"
                    value={latestData?.oxygen || 0}
                    unit="%"
                    icon={Wind}
                    color="blue"
                    lowWarning={90}
                  />
                  <ResourceGauge
                    name="Water"
                    value={latestData?.water || 0}
                    unit="%"
                    icon={Droplet}
                    color="blue"
                    lowWarning={70}
                  />
                  <ResourceGauge
                    name="Fuel"
                    value={latestData?.fuel || 0}
                    unit="%"
                    icon={Flame}
                    color="orange"
                    lowWarning={15}
                  />
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-light">Recent Alerts</h3>
                <button
                  className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
                  onClick={() => setSelectedTab("alerts")}
                >
                  View All
                </button>
              </div>
              <div className="divide-y divide-gray-700/30">
                {systemAlerts.length > 0 ? (
                  systemAlerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="py-3 flex items-start">
                      <div className="mr-3">{getAlertIcon(alert.type)}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={
                              alert.type === "warning"
                                ? "text-yellow-400"
                                : alert.type === "critical"
                                ? "text-red-400"
                                : "text-blue-400"
                            }
                          >
                            {alert.system}
                          </span>
                          <span className="text-xs text-gray-500">
                            {alert.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-gray-300">{alert.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-gray-500">
                    No alerts at this time
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Systems Tab */}
        {selectedTab === "systems" && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* System Health Overview */}
              <div className="lg:col-span-1 bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h3 className="text-lg font-light mb-4">System Health</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Nominal",
                            value: Object.values(
                              latestData?.systems || {}
                            ).filter((s) => s === "NOMINAL").length,
                          },
                          {
                            name: "Warning",
                            value: Object.values(
                              latestData?.systems || {}
                            ).filter((s) => s === "WARNING").length,
                          },
                          {
                            name: "Critical",
                            value: Object.values(
                              latestData?.systems || {}
                            ).filter((s) => s === "CRITICAL").length,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#10B981" /> {/* Nominal - Green */}
                        <Cell fill="#F59E0B" /> {/* Warning - Yellow */}
                        <Cell fill="#EF4444" /> {/* Critical - Red */}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111827",
                          border: "1px solid #374151",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Detailed System Status */}
              <div className="lg:col-span-2 bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h3 className="text-lg font-light mb-4">System Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {latestData &&
                    Object.entries(latestData.systems).map(
                      ([system, status]) => (
                        <div
                          key={system}
                          className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              {React.createElement(
                                systemIcons[system] || Server,
                                {
                                  className: `w-5 h-5 mr-2 ${
                                    status === "NOMINAL"
                                      ? "text-green-400"
                                      : status === "WARNING"
                                      ? "text-yellow-400"
                                      : "text-red-400"
                                  }`,
                                }
                              )}
                              <h4 className="text-lg capitalize">{system}</h4>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                status === "NOMINAL"
                                  ? "bg-green-500/20 text-green-400"
                                  : status === "WARNING"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {status}
                            </span>
                          </div>
                          <div className="mt-2">
                            <div className="text-sm text-gray-500 mb-1">
                              Diagnostic Summary
                            </div>
                            <div className="text-gray-300">
                              {status === "NOMINAL"
                                ? "All parameters within acceptable ranges. System functioning normally."
                                : status === "WARNING"
                                ? "System parameters outside optimal range. Monitoring required."
                                : "Critical threshold exceeded. Immediate attention required."}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                </div>
              </div>
            </div>

            {/* System Performance Trends */}
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30 mb-6">
              <h3 className="text-lg font-light mb-4">System Performance</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={historicalData.filter((_, i) => i % 2 === 0)}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                    <XAxis
                      dataKey="timestamp"
                      stroke="#4B5563"
                      tickFormatter={(timestamp) =>
                        new Date(timestamp).toLocaleTimeString()
                      }
                    />
                    <YAxis stroke="#4B5563" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111827",
                        border: "1px solid #374151",
                        borderRadius: "0.5rem",
                      }}
                      labelFormatter={(timestamp) =>
                        new Date(timestamp).toLocaleTimeString()
                      }
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="power"
                      stackId="1"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.3}
                      name="Power"
                    />
                    <Area
                      type="monotone"
                      dataKey="oxygen"
                      stackId="2"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                      name="Oxygen"
                    />
                    <Area
                      type="monotone"
                      dataKey="water"
                      stackId="3"
                      stroke="#38BDF8"
                      fill="#38BDF8"
                      fillOpacity={0.3}
                      name="Water"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Environment Tab */}
        {selectedTab === "environment" && (
          <div>
            {/* Temperature & Radiation History */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h3 className="text-lg font-light mb-3 flex items-center">
                  <Thermometer className="w-5 h-5 mr-2 text-red-400" />
                  Temperature
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={telemetryData.slice(-40)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                      <XAxis
                        dataKey="timestamp"
                        stroke="#4B5563"
                        tickFormatter={(timestamp) =>
                          new Date(timestamp).toLocaleTimeString()
                        }
                      />
                      <YAxis stroke="#4B5563" domain={["auto", "auto"]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111827",
                          border: "1px solid #374151",
                          borderRadius: "0.5rem",
                        }}
                        labelFormatter={(timestamp) =>
                          new Date(timestamp).toLocaleTimeString()
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="temperature"
                        stroke="#EF4444"
                        name="Temperature (°C)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h3 className="text-lg font-light mb-3 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-yellow-400" />
                  Radiation
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={telemetryData.slice(-40)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                      <XAxis
                        dataKey="timestamp"
                        stroke="#4B5563"
                        tickFormatter={(timestamp) =>
                          new Date(timestamp).toLocaleTimeString()
                        }
                      />
                      <YAxis stroke="#4B5563" domain={["auto", "auto"]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111827",
                          border: "1px solid #374151",
                          borderRadius: "0.5rem",
                        }}
                        labelFormatter={(timestamp) =>
                          new Date(timestamp).toLocaleTimeString()
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="radiation"
                        stroke="#F59E0B"
                        name="Radiation (µSv/h)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Environmental Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h3 className="text-lg font-light mb-3">
                  Atmospheric Composition
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400 text-sm">Oxygen</span>
                      <span className="text-blue-400 text-sm">21.3%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: "21.3%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400 text-sm">Nitrogen</span>
                      <span className="text-green-400 text-sm">78.1%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "78.1%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400 text-sm">
                        Carbon Dioxide
                      </span>
                      <span className="text-red-400 text-sm">0.4%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: "0.4%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400 text-sm">Other Gases</span>
                      <span className="text-purple-400 text-sm">0.2%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: "0.2%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h3 className="text-lg font-light mb-3">
                  Environmental Parameters
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Pressure</div>
                    <div className="text-xl font-light">
                      101.3 <span className="text-sm text-gray-400">kPa</span>
                    </div>
                    <div className="text-sm text-green-400 mt-1">Nominal</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Humidity</div>
                    <div className="text-xl font-light">
                      43 <span className="text-sm text-gray-400">%</span>
                    </div>
                    <div className="text-sm text-green-400 mt-1">Nominal</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">CO₂ Level</div>
                    <div className="text-xl font-light">
                      412 <span className="text-sm text-gray-400">ppm</span>
                    </div>
                    <div className="text-sm text-green-400 mt-1">Nominal</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">
                      Air Quality
                    </div>
                    <div className="text-xl font-light">
                      95 <span className="text-sm text-gray-400">%</span>
                    </div>
                    <div className="text-sm text-green-400 mt-1">Excellent</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">
                      Particle Count
                    </div>
                    <div className="text-xl font-light">
                      24 <span className="text-sm text-gray-400">μg/m³</span>
                    </div>
                    <div className="text-sm text-green-400 mt-1">Low</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Air Flow</div>
                    <div className="text-xl font-light">
                      0.3 <span className="text-sm text-gray-400">m/s</span>
                    </div>
                    <div className="text-sm text-green-400 mt-1">Nominal</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Communications Tab */}
        {selectedTab === "comms" && (
          <div>
            {/* Signal Strength & Quality */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h3 className="text-lg font-light mb-3 flex items-center">
                  <Wifi className="w-5 h-5 mr-2 text-blue-400" />
                  Signal Strength
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={telemetryData.slice(-40)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                      <XAxis
                        dataKey="timestamp"
                        stroke="#4B5563"
                        tickFormatter={(timestamp) =>
                          new Date(timestamp).toLocaleTimeString()
                        }
                      />
                      <YAxis stroke="#4B5563" domain={[70, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111827",
                          border: "1px solid #374151",
                          borderRadius: "0.5rem",
                        }}
                        labelFormatter={(timestamp) =>
                          new Date(timestamp).toLocaleTimeString()
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="signals.strength"
                        stroke="#3B82F6"
                        name="Signal Strength (%)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h3 className="text-lg font-light mb-3 flex items-center">
                  <Radio className="w-5 h-5 mr-2 text-green-400" />
                  Signal Quality & Latency
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={telemetryData.slice(-40)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                      <XAxis
                        dataKey="timestamp"
                        stroke="#4B5563"
                        tickFormatter={(timestamp) =>
                          new Date(timestamp).toLocaleTimeString()
                        }
                      />
                      <YAxis
                        yAxisId="left"
                        stroke="#10B981"
                        domain={[80, 100]}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#F59E0B"
                        domain={[0, 100]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111827",
                          border: "1px solid #374151",
                          borderRadius: "0.5rem",
                        }}
                        labelFormatter={(timestamp) =>
                          new Date(timestamp).toLocaleTimeString()
                        }
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="signals.quality"
                        stroke="#10B981"
                        name="Quality (%)"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="signals.latency"
                        stroke="#F59E0B"
                        name="Latency (ms)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Communication Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-1 bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h3 className="text-lg font-light mb-3">
                  Communication Channels
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <Radio className="w-4 h-4 text-blue-400 mr-2" />
                      <span>Primary Link</span>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <Radio className="w-4 h-4 text-blue-400 mr-2" />
                      <span>Backup Link</span>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400">
                      Standby
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <Radio className="w-4 h-4 text-blue-400 mr-2" />
                      <span>Emergency Channel</span>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400">
                      Standby
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <Radio className="w-4 h-4 text-blue-400 mr-2" />
                      <span>Crew Voice</span>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <h3 className="text-lg font-light mb-3">Data Transmission</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">
                      Download Rate
                    </div>
                    <div className="text-xl font-light">
                      32.7 <span className="text-sm text-gray-400">Mbps</span>
                    </div>
                    <div className="text-sm text-green-400 mt-1">Normal</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">
                      Upload Rate
                    </div>
                    <div className="text-xl font-light">
                      18.2 <span className="text-sm text-gray-400">Mbps</span>
                    </div>
                    <div className="text-sm text-green-400 mt-1">Normal</div>
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-gray-500">Bandwidth Usage</div>
                    <div className="text-sm text-gray-400">64%</div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: "64%" }}
                    ></div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm text-gray-500">Telemetry</div>
                      <div className="text-blue-400">35%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Video</div>
                      <div className="text-green-400">45%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Voice</div>
                      <div className="text-purple-400">20%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {selectedTab === "alerts" && (
          <div>
            {/* Filter Controls */}
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30 mb-6">
              <div className="flex flex-wrap gap-3">
                <button className="px-3 py-1 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                  All Alerts
                </button>
                <button className="px-3 py-1 rounded-full bg-gray-900/50 text-gray-300 hover:bg-gray-700 transition-colors">
                  Critical
                </button>
                <button className="px-3 py-1 rounded-full bg-gray-900/50 text-gray-300 hover:bg-gray-700 transition-colors">
                  Warning
                </button>
                <button className="px-3 py-1 rounded-full bg-gray-900/50 text-gray-300 hover:bg-gray-700 transition-colors">
                  Info
                </button>
              </div>
            </div>

            {/* Alerts List */}
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
              <h3 className="text-lg font-light mb-4">System Alerts</h3>
              <div className="divide-y divide-gray-700/30">
                {systemAlerts.length > 0 ? (
                  systemAlerts.map((alert) => (
                    <div key={alert.id} className="py-4 flex items-start">
                      <div className="mr-3">{getAlertIcon(alert.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={
                              alert.type === "warning"
                                ? "text-yellow-400 font-medium"
                                : alert.type === "critical"
                                ? "text-red-400 font-medium"
                                : "text-blue-400 font-medium"
                            }
                          >
                            {alert.system}
                          </span>
                          <span className="text-xs text-gray-500">
                            {alert.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-2">{alert.message}</p>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
                            Acknowledge
                          </button>
                          <button className="px-3 py-1 text-xs rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No alerts at this time</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TelemetryDashboard;
