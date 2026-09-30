import { useEffect, useState } from 'react'
import { LogOut } from 'lucide-react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import { useApp } from '../context/AppStateContext'
import { signOut } from '../services/auth'

export default function DashboardLayout() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)
  const { error, toast } = useApp()

  useEffect(() => {
    const currentState = window.history.state || {}
    if (!currentState.havenLogoutGuard) {
      window.history.replaceState({ ...currentState, havenLogoutBoundary: true }, '', window.location.href)
      window.history.pushState({ ...currentState, havenLogoutGuard: true }, '', window.location.href)
    }

    const handleBack = (event) => {
      if (!event.state?.havenLogoutBoundary) return
      window.history.pushState({ ...event.state, havenLogoutBoundary: false, havenLogoutGuard: true }, '', window.location.href)
      setConfirmLogout(true)
    }

    window.addEventListener('popstate', handleBack)
    return () => window.removeEventListener('popstate', handleBack)
  }, [])

  const logout = () => {
    signOut()
    navigate('/login', { replace: true })
  }

  return <div className="app-shell"><Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /><div className="app-main"><Navbar onMenu={() => setSidebarOpen(true)} /><main className="content">{error ? <div className="loading-state">Backend connection failed: {error}</div> : <Outlet />}</main></div><Toast message={toast} />
    {confirmLogout && <Modal title="Logout from Haven Society?" onClose={() => setConfirmLogout(false)}><div className="confirm-body"><p>You are currently signed in. Would you like to logout before leaving the application?</p><div className="modal-actions"><button className="button secondary" onClick={() => setConfirmLogout(false)}>Stay signed in</button><button className="button danger" onClick={logout}><LogOut size={17} />Logout</button></div></div></Modal>}
  </div>
}
