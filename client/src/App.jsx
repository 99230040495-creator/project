import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import RouteOptimization from './pages/RouteOptimization';
import Weather from './pages/Weather';
import CatchHistory from './pages/CatchHistory';
import GlobalView from './pages/GlobalView';
import Profile from './pages/Profile';
import VoiceAssistant from './components/VoiceAssistant';
import BottomNav from './components/BottomNav';
import MarketPrices from './pages/MarketPrices';
import SentinelHUD from './pages/SentinelHUD';
import NeptuneCore from './pages/NeptuneCore';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#020617] text-white font-sans relative">
        <Navbar />
        <VoiceAssistant />
        <main className="pt-20 px-4 md:px-0">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/prediction" element={<ProtectedRoute><Prediction /></ProtectedRoute>} />
            <Route path="/route" element={<ProtectedRoute><RouteOptimization /></ProtectedRoute>} />
            <Route path="/weather" element={<ProtectedRoute><Weather /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><CatchHistory /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/global-view" element={<ProtectedRoute><GlobalView /></ProtectedRoute>} />
            <Route path="/market" element={<ProtectedRoute><MarketPrices /></ProtectedRoute>} />
            <Route path="/sentinel" element={<ProtectedRoute><SentinelHUD /></ProtectedRoute>} />
            <Route path="/neptune" element={<ProtectedRoute><NeptuneCore /></ProtectedRoute>} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
