import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import InstrumentsList from "./pages/InstrumentsList";
import InstrumentDetails from "./pages/InstrumentDetails";
import NasaDashboard from "./components/nasa/NasaDashboard";
import UpdatesPage from "./pages/UpdatesPage";
import DiscoveriesPage from "./pages/DiscoveriesPage";
import NotFoundPage from "./components/NotFoundPage";
import MarsExplorer from "./components/nasa/MarsExplorer";
import NeoTracker from "./components/nasa/NeoTracker";
import LaunchesPage from "./pages/LaunchesPage";
import Footer from "./components/Footer";
import TelemetryDashboard from "./components/mission/TelemetryDashboard";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-900">
        <Navbar />
        <main className="flex-grow">
          {" "}
          {/* Removed pt-20 as it's now in each component */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/instruments" element={<InstrumentsList />} />
            <Route path="/instrument/:id" element={<InstrumentDetails />} />
            <Route path="/discoveries" element={<DiscoveriesPage />} />
            <Route path="/updates" element={<UpdatesPage />} />
            <Route path="/nasa" element={<NasaDashboard />} />
            <Route path="/launches" element={<LaunchesPage />} />
            <Route path="/nasa/mars" element={<MarsExplorer />} />
            <Route path="/nasa/neo" element={<NeoTracker />} />
            <Route path="/mission/telemetry" element={<TelemetryDashboard />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
