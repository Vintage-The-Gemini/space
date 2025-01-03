import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import InstrumentsList from './pages/InstrumentsList';
import InstrumentDetails from './pages/InstrumentDetails';
import UpdatesPage from './pages/UpdatesPage';
import DiscoveriesPage from './pages/DiscoveriesPage';
import LaunchesPage from './pages/LaunchesPage';
import NotFoundPage from './components/NotFoundPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <main className="mx-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/instruments" element={<InstrumentsList />} />
            <Route path="/instrument/:id" element={<InstrumentDetails />} />
            <Route path="/discoveries" element={<DiscoveriesPage />} />
            <Route path="/launches" element={<LaunchesPage />} />
            <Route path="/updates" element={<UpdatesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;