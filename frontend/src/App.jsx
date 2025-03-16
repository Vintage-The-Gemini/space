import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage"; // Import from pages instead of components
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
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="flex flex-col min-h-screen bg-black">
          <Navbar />
          <main className="flex-grow">
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
              <Route
                path="/mission/telemetry"
                element={<TelemetryDashboard />}
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
