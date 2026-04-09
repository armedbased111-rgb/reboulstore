import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { useToast } from '../../contexts/ToastContext'
import { subscribeNewsletter } from '../../services/newsletterService'
import { EARLY_ACCESS } from '../../copy/earlyAccess'
import { SITE_NAME } from '../../seo/siteSeo'
import { TechnicalDecorFrame } from '../decorative'

const STORAGE_KEY = 'reboul_newsletter_modal_v1'
const OPEN_DELAY_MS = 1400

/** Même asset que le footer (Layout) — monochrome forcé en noir pour le panneau clair */
const REBOUL_LOGO_SRC =
  'https://res.cloudinary.com/dxen69pdo/image/upload/v1753365190/logo_w_hzhfoc.png'

type NewsletterEntryModalProps = {
  appReady: boolean
}

export const NewsletterEntryModal = ({ appReady }: NewsletterEntryModalProps) => {
  const { showToast } = useToast()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const v = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      showToast({ message: 'Adresse e-mail invalide.', duration: 4000 })
      return
    }
    setSubmitting(true)
    try {
      const res = await subscribeNewsletter(v, 'modal_v1')
      persistClose('subscribed')
      showToast({
        message: res.alreadySubscribed
          ? 'Cette adresse est déjà inscrite. Merci pour votre intérêt.'
          : 'Merci. Vérifiez votre boîte mail : un message de confirmation vous a été envoyé.',
        duration: 6500,
      })
    } catch {
      showToast({
        message: 'Envoi impossible pour le moment. Réessayez plus tard.',
        duration: 5000,
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/55 p-4 sm:p-6"
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
        className="relative flex w-full max-w-[520px] flex-col overflow-hidden rounded-xl border border-black/10 bg-white md:max-w-[min(92vw,760px)] md:flex-row"
      >
        <TechnicalDecorFrame
          datum={EARLY_ACCESS.frameDatum}
          datumClassName="max-md:right-5 max-md:top-[3.25rem] max-md:left-auto max-md:bottom-auto max-md:text-right md:bottom-5 md:left-8"
          omitCorners={['tr', 'bl']}
          sideTicks={false}
          insetClassName="inset-5 sm:inset-6 md:inset-6"
        />
        <div
          className="relative z-[1] flex min-h-[min(32vh,200px)] w-full shrink-0 items-center justify-center px-10 py-10 md:min-h-[min(72vh,440px)] md:w-[42%] md:max-w-[300px] md:py-14"
          style={{ backgroundColor: '#F3F3F3' }}
        >
          <img
            src={REBOUL_LOGO_SRC}
            alt=""
            width={400}
            height={120}
            className="h-32 w-auto max-w-[95%] object-contain [filter:brightness(0)] sm:h-36 md:h-48 md:max-w-[min(95%,17rem)] lg:h-52"
            decoding="async"
          />
        </div>

        <div className="relative z-[3] flex flex-1 flex-col px-6 pb-8 pt-10 sm:px-8 sm:pb-10 sm:pt-12">
          <button
            type="button"
            onClick={() => persistClose('dismiss')}
            className="absolute right-3 top-3 z-10 p-2 text-black transition-opacity hover:opacity-60"
            aria-label="Fermer"
          >
            <X className="size-5 stroke-[1]" aria-hidden />
          </button>

          <p
            id={titleId}
            className="text-center text-sm font-bold uppercase tracking-tight text-black sm:text-base"
          >
            REBOULSTORE&nbsp;2.0
          </p>

          <div id={descId} className="mt-6 space-y-4 text-center">
            <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-black/30 sm:text-[9px]">
              {EARLY_ACCESS.hudLine}
            </p>
            <p className="text-[11px] font-medium uppercase leading-relaxed tracking-[0.12em] text-black/75 sm:text-xs sm:tracking-[0.14em]">
              Soyez les premiers informés des lancements, collections et événements{' '}
              {SITE_NAME.toUpperCase()}.
            </p>
            <div
              className="mx-auto mt-1 max-w-[min(100%,24rem)] rounded-md border border-black/10 border-l-[3px] border-l-black bg-[#E8E8E8] px-3.5 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] sm:px-4 sm:py-3.5"
              role="note"
            >
              <p className="font-mono text-[8px] font-medium uppercase tracking-[0.28em] text-black/40">
                {EARLY_ACCESS.noteLabel}
              </p>
              <p className="mt-2 text-[10px] font-medium uppercase leading-relaxed tracking-[0.09em] text-black/60 sm:text-[11px] sm:tracking-[0.1em]">
                {EARLY_ACCESS.summary.toUpperCase()}
              </p>
            </div>

            <div className="mx-auto mt-5 max-w-[min(100%,26rem)] text-left">
              <p className="font-mono text-[8px] uppercase tracking-[0.26em] text-black/35">
                {EARLY_ACCESS.yearlyComms.kicker}
              </p>
              <ul className="mt-2.5 list-none space-y-2 pl-0">
                {EARLY_ACCESS.yearlyComms.lines.map((line) => (
                  <li
                    key={line}
                    className="flex gap-2 text-[10px] font-medium uppercase leading-relaxed tracking-[0.08em] text-black/55 sm:text-[11px] sm:tracking-[0.09em]"
                  >
                    <span className="mt-[0.35em] size-1 shrink-0 rounded-full bg-black/25" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-10">
            <label htmlFor="newsletter-email" className="sr-only">
              Adresse e-mail
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="E-MAIL"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              className="w-full border-0 border-b border-black/25 bg-transparent px-0 py-3 text-[13px] font-medium uppercase tracking-[0.08em] text-black placeholder:text-black/40 focus:border-black focus:outline-none focus-visible:ring-0"
            />

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-[6px] bg-black py-3 text-center text-[13px] font-normal uppercase tracking-wide text-white transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {submitting ? 'ENVOI…' : 'S’INSCRIRE'}
            </button>
          </form>

          <p className="mt-6 text-center text-[10px] font-medium uppercase leading-relaxed tracking-[0.1em] text-black/45">
            En vous inscrivant, vous acceptez de recevoir des e-mails marketing.{' '}
            <Link
              to="/politique-de-confidentialite"
              className="text-black/55 underline decoration-black/30 underline-offset-[3px] transition-colors hover:text-black hover:decoration-black"
            >
              Politique de confidentialité
            </Link>
            .
          </p>

          <button
            type="button"
            onClick={() => persistClose('dismiss')}
            className="mt-8 w-full text-center text-[11px] font-medium uppercase tracking-[0.14em] text-black underline decoration-black/35 underline-offset-[5px] transition-colors hover:decoration-black"
          >
            Non merci
          </button>
        </div>
      </div>
    </div>
  )
}
