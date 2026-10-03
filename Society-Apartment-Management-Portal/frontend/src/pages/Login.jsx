import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Eye, EyeOff, LockKeyhole, ShieldCheck, Users } from 'lucide-react'
import { getDemoAccounts, signIn } from '../services/auth'

export default function Login() {
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState([])
  const [selectedRole, setSelectedRole] = useState('Admin')
  const [selectedBlock, setSelectedBlock] = useState('')
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [email, setEmail] = useState('admin@havenwoods.in')
  const [password, setPassword] = useState('admin123')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')

  const selectAccount = (accountId, source = accounts) => {
    const account = source.find((item) => item.id === accountId)
    if (!account) return
    setEmail(account.email)
    setPassword(account.demoPassword)
    setError('')
  }

  const selectRole = (role) => {
    const matchingAccounts = accounts.filter((item) => item.role === role)
    const block = matchingAccounts.find((item) => item.block)?.block || ''
    const account = matchingAccounts.find((item) => !block || item.block === block)
    if (!account) return
    setSelectedRole(role)
    setSelectedBlock(block)
    setSelectedAccountId(account.id)
    selectAccount(account.id)
  }

  const selectBlock = (block) => {
    const account = accounts.find((item) => item.role === selectedRole && item.block === block)
    if (!account) return
    setSelectedBlock(block)
    setSelectedAccountId(account.id)
    selectAccount(account.id)
  }

  useEffect(() => {
    let active = true
    getDemoAccounts().then((loadedAccounts) => {
      if (!active) return
      const account = loadedAccounts.find((item) => item.role === 'Admin') || loadedAccounts[0]
      setAccounts(loadedAccounts)
      if (account) {
        setSelectedRole(account.role)
        setSelectedBlock(account.block || '')
        setSelectedAccountId(account.id)
        setEmail(account.email)
        setPassword(account.demoPassword)
        setError('')
      }
    }).catch((loadError) => active && setError(loadError.message))
    return () => { active = false }
  }, [])

  const selectedAccount = accounts.find((account) => account.id === selectedAccountId)
  const demoRoles = [...new Set(accounts.map((account) => account.role))]
  const roleAccounts = accounts.filter((account) => account.role === selectedRole)
  const roleBlocks = [...new Set(roleAccounts.map((account) => account.block).filter(Boolean))]
  const visibleAccounts = selectedBlock ? roleAccounts.filter((account) => account.block === selectedBlock) : roleAccounts

  const login = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await signIn(email, password)
      navigate('/', { replace: true })
    } catch (loginError) {
      setError(loginError.message)
    }
  }

  return <main className="login-page">
    <section className="login-brand">
      <div className="login-logo"><Building2 size={25} />Haven Society</div>
      <div className="login-message"><span className="eyebrow">Connected community living</span><h1>One society. A workspace for every role.</h1><p>Administrators, committee members, residents, and staff each receive the tools and records relevant to their responsibilities.</p><div className="login-proof"><div><span><Users /></span><b>7 roles</b><small>Purpose-built access</small></div><div><span><ShieldCheck /></span><b>Scoped</b><small>Role permissions</small></div></div></div>
      <div className="building-art"><div className="tower one">{Array.from({ length: 16 }).map((_, index) => <i key={index} />)}</div><div className="tower two">{Array.from({ length: 20 }).map((_, index) => <i key={index} />)}</div><div className="tower three">{Array.from({ length: 12 }).map((_, index) => <i key={index} />)}</div></div>
    </section>
    <section className="login-form-wrap"><form className="login-form" onSubmit={login}>
      <div className="mobile-login-logo"><Building2 size={23} />Haven Society</div><span className="eyebrow">Welcome back</span><h2>Sign in to your workspace</h2><p>Choose a demo role or enter account credentials.</p>
      <div className={`demo-account-grid${roleBlocks.length ? ' has-block' : ''}`}>
        <label className="field demo-role-select"><span>Role</span><select value={selectedRole} onChange={(event) => selectRole(event.target.value)} disabled={!accounts.length}>{demoRoles.map((role) => <option key={role} value={role}>{role}</option>)}</select></label>
        {roleBlocks.length > 0 && <label className="field demo-role-select"><span>Block</span><select value={selectedBlock} onChange={(event) => selectBlock(event.target.value)}>{roleBlocks.map((block) => <option key={block} value={block}>Block {block}</option>)}</select></label>}
        <label className="field demo-role-select"><span>Member</span><select value={selectedAccountId} onChange={(event) => { setSelectedAccountId(event.target.value); selectAccount(event.target.value) }} disabled={!accounts.length}>{visibleAccounts.map((account) => <option key={account.id} value={account.id}>{account.name}{account.flatLabel ? ` · ${account.flatLabel}` : ''}</option>)}</select></label>
      </div>
      {selectedAccount && <div className="selected-account-summary"><span><b>{selectedAccount.name}</b>{selectedAccount.residentType ? ` · ${selectedAccount.residentType}` : ` · ${selectedAccount.role}`}</span><span>{selectedAccount.flatLabel || selectedAccount.email}</span></div>}
      <label className="field"><span>Email address</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
      <label className="field"><span>Password</span><div className="password-input"><LockKeyhole size={18} /><input type={show ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} required /><button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
      <div className="login-options"><label><input type="checkbox" defaultChecked />Remember me</label><button type="button" onClick={() => setError('Password reset requires the future backend email service.')}>Forgot password?</button></div>
      {error && <div className="login-error">{error}</div>}<button className="button primary login-submit">Sign in</button>
      <div className="demo-note"><b>MySQL-backed role demonstration</b><span>The selected role fills its demo credentials automatically.</span><small>Authentication and authorization are enforced by the Express API.</small></div>
    </form></section>
  </main>
}
