import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function LoginPopover() {
  const { isAuthenticated, user, login, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, right: 0 })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const toggle = () => {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + 8, right: window.innerWidth - r.right })
    }
    setOpen(o => !o)
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login({ email, password })
      setOpen(false)
      setEmail('')
      setPassword('')
    } catch {
      setError('Email ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  const label = isAuthenticated
    ? (user?.firstName ? user.firstName.toUpperCase() : 'MON COMPTE')
    : 'CONNEXION'

  const popover = open ? (
    <div
      ref={popoverRef}
      style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 9999 }}
      className="w-64 bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
    >
          {isAuthenticated ? (
            <div className="p-5 space-y-0.5">
              <p className="text-[10px] text-stone-400 tracking-widest uppercase mb-4">
                {user?.email}
              </p>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center py-2 text-[11px] uppercase tracking-widest font-medium text-stone-800 hover:text-black transition-colors"
              >
                Mon compte
              </Link>
              <Link
                to="/orders"
                onClick={() => setOpen(false)}
                className="flex items-center py-2 text-[11px] uppercase tracking-widest font-medium text-stone-800 hover:text-black transition-colors"
              >
                Mes commandes
              </Link>
              <div className="pt-3 mt-2 border-t border-stone-100">
                <button
                  onClick={() => { logout(); setOpen(false) }}
                  className="text-[11px] uppercase tracking-widest text-stone-400 hover:text-black transition-colors"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="p-5 space-y-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ borderRadius: '12px', background: '#f5f5f4', border: 'none' }}
                className="w-full px-4 py-3 text-sm text-black placeholder:text-stone-400 focus:outline-none focus:bg-stone-200 transition-colors"
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ borderRadius: '12px', background: '#f5f5f4', border: 'none' }}
                className="w-full px-4 py-3 text-sm text-black placeholder:text-stone-400 focus:outline-none focus:bg-stone-200 transition-colors"
              />
              {error && (
                <p className="text-[11px] text-red-400 pl-1">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                style={{ borderRadius: '12px' }}
                className="w-full bg-black text-white text-[11px] uppercase tracking-widest py-3 font-medium hover:bg-stone-800 transition-colors disabled:opacity-40 mt-1"
              >
                {loading ? '···' : 'Se connecter'}
              </button>
              <div className="flex items-center justify-between pt-1">
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="text-[10px] tracking-wider uppercase text-stone-400 hover:text-black transition-colors"
                >
                  Créer un compte
                </Link>
                <Link
                  to="/forgot-password"
                  onClick={() => setOpen(false)}
                  className="text-[10px] text-stone-400 hover:text-black transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </form>
          )}
    </div>
  ) : null

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        className="text-black uppercase text-sm font-medium hover:opacity-70 transition-opacity"
      >
        {label}
      </button>
      {createPortal(popover, document.body)}
    </>
  )
}
