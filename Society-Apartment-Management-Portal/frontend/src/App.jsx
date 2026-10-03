import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Flats from './pages/Flats'
import Residents from './pages/Residents'
import Visitors from './pages/Visitors'
import Staff from './pages/Staff'
import Maintenance from './pages/Maintenance'
import Payments from './pages/Payments'
import Complaints from './pages/Complaints'
import Notices from './pages/Notices'
import Amenities from './pages/Amenities'
import Bookings from './pages/Bookings'
import Settings from './pages/Settings'
import Login from './pages/Login'

function App() {
  return <BrowserRouter><AppProvider><Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
      <Route index element={<Dashboard />} />
      <Route path="flats" element={<Flats />} />
      <Route path="residents" element={<Residents />} />
      <Route path="visitors" element={<Visitors />} />
      <Route path="staff" element={<Staff />} />
      <Route path="maintenance" element={<Maintenance />} />
      <Route path="payments" element={<Payments />} />
      <Route path="complaints" element={<Complaints />} />
      <Route path="notices" element={<Notices />} />
      <Route path="amenities" element={<Amenities />} />
      <Route path="bookings" element={<Bookings />} />
      <Route path="settings" element={<Settings />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></AppProvider></BrowserRouter>
}

export default App
