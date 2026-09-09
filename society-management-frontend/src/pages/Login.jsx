import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Eye, EyeOff, LockKeyhole, ShieldCheck, Users } from 'lucide-react'
import { demoAccounts, signIn } from '../services/auth'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@havenwoods.in')
  const [password, setPassword] = useState('admin123')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')

  const selectAccount = (accountId) => {
    const account = demoAccounts.find((item) => item.id === accountId)
    if (!account) return
    setEmail(account.email)
    setPassword(account.demoPassword)
    setError('')
  }

  const login = (event) => {
    event.preventDefault()
    const user = signIn(email, password)
    if (user) navigate('/')
    else setError('Email or password is incorrect. Select a demo role or enter valid credentials.')
  }

  return <main className="login-page">
    <section className="login-brand">
      <div className="login-logo"><Building2 size={25} />Haven Society</div>
      <div className="login-message"><span className="eyebrow">Connected community living</span><h1>One society. A workspace for every role.</h1><p>Administrators, committee members, residents, and staff each receive the tools and records relevant to their responsibilities.</p><div className="login-proof"><div><span><Users /></span><b>8 roles</b><small>Purpose-built access</small></div><div><span><ShieldCheck /></span><b>Scoped</b><small>Role permissions</small></div></div></div>
      <div className="building-art"><div className="tower one">{Array.from({ length: 16 }).map((_, index) => <i key={index} />)}</div><div className="tower two">{Array.from({ length: 20 }).map((_, index) => <i key={index} />)}</div><div className="tower three">{Array.from({ length: 12 }).map((_, index) => <i key={index} />)}</div></div>
    </section>
    <section className="login-form-wrap"><form className="login-form" onSubmit={login}>
      <div className="mobile-login-logo"><Building2 size={23} />Haven Society</div><span className="eyebrow">Welcome back</span><h2>Sign in to your workspace</h2><p>Choose a demo role or enter account credentials.</p>
      <label className="field demo-role-select"><span>Demo Role</span><select defaultValue="admin" onChange={(event) => selectAccount(event.target.value)}>{demoAccounts.map((account) => <option key={account.id} value={account.id}>{account.role} · {account.name}</option>)}</select></label>
      <label className="field"><span>Email address</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
      <label className="field"><span>Password</span><div className="password-input"><LockKeyhole size={18} /><input type={show ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} required /><button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
      <div className="login-options"><label><input type="checkbox" defaultChecked />Remember me</label><button type="button" onClick={() => setError('Password reset requires the future backend email service.')}>Forgot password?</button></div>
      {error && <div className="login-error">{error}</div>}<button className="button primary login-submit">Sign in</button>
      <div className="demo-note"><b>Frontend role demonstration</b><span>The selected role fills its demo credentials automatically.</span><small>Production authentication and authorization must be enforced by the backend.</small></div>
    </form></section>
  </main>
}
