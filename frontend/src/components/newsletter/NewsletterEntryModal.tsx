import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { useToast } from '../../contexts/ToastContext'
import { SITE_NAME } from '../../seo/siteSeo'

const STORAGE_KEY = 'reboul_newsletter_modal_v1'
const OPEN_DELAY_MS = 1400

type NewsletterEntryModalProps = {
  appReady: boolean
}

export const NewsletterEntryModal = ({ appReady }: NewsletterEntryModalProps) => {
  const { showToast } = useToast()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    if (!appReady) return
    try {
      if (localStorage.getItem(STORAGE_KEY)) return
    } catch {
      return
    }
    const t = window.setTimeout(() => setOpen(true), OPEN_DELAY_MS)
    return () => window.clearTimeout(t)
  }, [appReady])

  const persistClose = useCallback((reason: 'dismiss' | 'subscribed') => {
    try {
      localStorage.setItem(STORAGE_KEY, reason)
    } catch {
      /* ignore */
    }
    setOpen(false)
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focus = panelRef.current?.querySelector<HTMLInputElement>('input[type="email"]')
    focus?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') persistClose('dismiss')
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, persistClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const v = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      showToast({ message: 'Adresse e-mail invalide.', duration: 4000 })
      return
    }
    persistClose('subscribed')
    showToast({
      message: 'Merci. L’inscription sera finalisée lorsque le service e-mail sera branché.',
      duration: 6000,
    })
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: 'rgba(20, 20, 20, 0.6)' }}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) persistClose('dismiss')
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative w-full max-w-[420px] bg-white px-6 pb-8 pt-10 shadow-none sm:max-w-[440px] sm:px-8 sm:pb-10 sm:pt-12"
      >
        <button
          type="button"
          onClick={() => persistClose('dismiss')}
          className="absolute right-3 top-3 p-2 text-black/70 transition-opacity hover:opacity-100"
          aria-label="Fermer"
        >
          <X className="size-5 stroke-[1.5]" aria-hidden />
        </button>

        <p
          id={titleId}
          className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-black"
        >
          {SITE_NAME.replace(' ', '\u00a0')}
        </p>

        <p id={descId} className="mt-6 text-center text-[15px] font-light leading-snug text-black sm:text-base">
          Soyez les premiers informés des lancements, collections et événements {SITE_NAME}.
        </p>

        <form onSubmit={handleSubmit} className="mt-8">
          <label htmlFor="newsletter-email" className="sr-only">
            E-mail
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="E-mail"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            className="w-full border-0 border-b border-black/30 bg-transparent px-0 py-3 text-[15px] font-light text-black placeholder:text-black/45 focus:border-black focus:outline-none focus:ring-0"
          />

          <button
            type="submit"
            className="mt-5 w-full bg-black py-3.5 text-center text-[13px] font-normal uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
          >
            S’inscrire
          </button>
        </form>

        <p className="mt-5 text-center text-[11px] font-light leading-relaxed text-black/55">
          En vous inscrivant, vous acceptez de recevoir des e-mails marketing.{' '}
          <Link to="/privacy" className="underline underline-offset-2 hover:text-black">
            Politique de confidentialité
          </Link>
          .
        </p>

        <button
          type="button"
          onClick={() => persistClose('dismiss')}
          className="mt-6 w-full text-center text-[13px] font-light text-black underline underline-offset-4 decoration-black/40 hover:decoration-black"
        >
          Non merci
        </button>
      </div>
    </div>
  )
}
