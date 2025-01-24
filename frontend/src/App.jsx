import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import InstrumentsList from './pages/InstrumentsList';
import InstrumentDetails from './pages/InstrumentDetails';
import NasaDashboard from './components/nasa/NasaDashboard';
import UpdatesPage from './pages/UpdatesPage';
import DiscoveriesPage from './pages/DiscoveriesPage';
import NotFoundPage from './components/NotFoundPage';
import MarsExplorer from './components/nasa/MarsExplorer';
import NeoTracker from './components/nasa/NeoTracker';
import LaunchesPage from './pages/LaunchesPage';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <main className="">
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
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
      <Footer/>
    </Router>
  );
}

export default App;