import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Toast from '../components/Toast'
import { useApp } from '../context/AppStateContext'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { toast } = useApp()
  return <div className="app-shell"><Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /><div className="app-main"><Navbar onMenu={() => setSidebarOpen(true)} /><main className="content"><Outlet /></main></div><Toast message={toast} /></div>
}
