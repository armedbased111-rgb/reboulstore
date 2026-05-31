import { useParams, Link } from 'react-router-dom'
import { useEffect, useState, useRef, useCallback } from 'react'
import { api } from '../api/client'
import { RefStatus, BatchEvent } from '../types'
import { StatusBadge } from '../components/ui/StatusBadge'
import { LogConsole } from '../components/ui/LogConsole'
import { ChevronLeft, Trash2, Wand2, Upload, Play, X, RefreshCw, Sparkles, Clapperboard, Zap, CloudUpload, Check, FlipHorizontal2, Crop } from 'lucide-react'

const ADJUST_PRESETS = [
  { label: 'Default',  prompt: 'Fond #F3F3F3 uniforme. Couleurs et détails du produit identiques à la photo source. Ajouter une légère ombre portée naturelle sous le produit.' },
  { label: 'Flat lay',  prompt: 'Perfect flat lay: garment lying flat, centered with even margins, no shadow. Smooth all fabric wrinkles and creases. Keep all logos, badges, colors and details pixel-perfect identical.' },
  { label: 'Dézoom',   prompt: 'Dezoom to show more white space/margin around the garment. Same product, same view, just smaller in frame with more equal margins.' },
  { label: 'Fond',     prompt: 'Replace the background with plain solid #F3F3F3 light grey. Do not touch the garment.' },
  { label: 'Ombre',    prompt: 'Remove harsh shadows. Keep only a very subtle soft shadow directly under the garment.' },
  { label: 'Fix étiquette (ref)',  prompt: 'Using the reference photo as ground truth, fix ONLY the label/tag visible on the garment (collar tag, woven label or patch). Copy the exact text, font, layout and colors from the reference.\n\nCRITICAL — do NOT change ANYTHING else: keep the EXACT same image dimensions, crop, framing, product scale, product position, background color, lighting and all garment details pixel-perfect identical to the target image. Only the label changes.' },
  { label: 'Fix étiquette shoe (ref)',  prompt: 'Using the reference photo as ground truth, fix ONLY these two things on the target image:\n1. The tongue label/tag: copy the exact text, font, layout and colors from the reference\n2. The sole: copy the exact markings, text and pattern from the reference sole\n\nCRITICAL — do NOT change ANYTHING else: same dimensions, same framing, same crop, same product scale and position, same background, same lighting.' },
]

type ScenePreset = { key: string; label: string; raw_prompt: string }

type TabMode = 'images' | 'campaign'

export function RefView() {
  const { name, ref } = useParams<{ name: string; ref: string }>()
  const brandName = decodeURIComponent(name!)
  const refName = decodeURIComponent(ref!)

  const [tab, setTab] = useState<TabMode>('images')
  const [data, setData] = useState<RefStatus | null>(null)

  // Adjust state
  const [selectedImg, setSelectedImg] = useState<string | null>(null)
  const [adjustTarget, setAdjustTarget] = useState<string>('') // fichier cible (output ou input)
  const [adjustTargetDir, setAdjustTargetDir] = useState<'output' | 'input'>('output')
  const [adjustPrompt, setAdjustPrompt] = useState('')
  const [adjustModel, setAdjustModel] = useState<'pro' | 'flash'>('pro')
  const [adjustRef, setAdjustRef] = useState<string>('none')
  const [adjustOverwrite, setAdjustOverwrite] = useState(false)
  const [adjustRunning, setAdjustRunning] = useState(false)
  const [adjustLogs, setAdjustLogs] = useState<BatchEvent[]>([])

  // Upload / Generate state
  const [uploadRunning, setUploadRunning] = useState(false)
  const [uploadLogs, setUploadLogs] = useState<BatchEvent[]>([])
  const [showUploadLog, setShowUploadLog] = useState(false)
  const [genRunning, setGenRunning] = useState(false)
  const [genLogs, setGenLogs] = useState<BatchEvent[]>([])
  const [showGenLog, setShowGenLog] = useState(false)
  const [batch2Running, setBatch2Running] = useState(false)
  const [batch2Logs, setBatch2Logs] = useState<BatchEvent[]>([])
  const [showBatch2Log, setShowBatch2Log] = useState(false)

  // Campaign state
  const [campSourceImg, setCampSourceImg] = useState<string>('')
  const [campScene, setCampScene] = useState('urban')
  const [campCustomPrompt, setCampCustomPrompt] = useState('')
  const [campScenePresets, setCampScenePresets] = useState<ScenePreset[]>([])
  const [campModel, setCampModel] = useState<'pro' | 'flash'>('pro')
  const [campCount, setCampCount] = useState(1)
  const [campRunning, setCampRunning] = useState(false)
  const [campProgress, setCampProgress] = useState<[number, number]>([0, 0]) // [done, total]
  const [campLogs, setCampLogs] = useState<BatchEvent[]>([])
  const [campImages, setCampImages] = useState<string[]>([])
  const [heroUploading, setHeroUploading] = useState<string | null>(null)
  const [heroUploaded, setHeroUploaded] = useState<Record<string, boolean>>({})
  const [heroForm, setHeroForm] = useState<{ img: string; title: string; subtitle: string; buttonLink: string } | null>(null)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [campAdjustImg, setCampAdjustImg] = useState<string | null>(null)
  const [campAdjustPrompt, setCampAdjustPrompt] = useState('')
  const [campAdjustModel, setCampAdjustModel] = useState<'pro' | 'flash'>('pro')
  const [campAdjustRunning, setCampAdjustRunning] = useState(false)
  const [campAdjustLogs, setCampAdjustLogs] = useState<BatchEvent[]>([])

  const esRef = useRef<EventSource | null>(null)
  const campRunningRef = useRef(false)

  // Brand assets (logos, étiquettes)
  const [brandAssets, setBrandAssets] = useState<string[]>([])
  useEffect(() => {
    api.get(`/assets/${encodeURIComponent(brandName)}`).then(setBrandAssets).catch(() => {})
  }, [brandName])

  // Modal Générer
  const [genModal, setGenModal] = useState(false)
  const [genModalModel, setGenModalModel] = useState<'flash' | 'pro'>('flash')
  const [genModalAttempts, setGenModalAttempts] = useState(4)
  const [genModalDelay, setGenModalDelay] = useState(30)
  const [genModalSkip, setGenModalSkip] = useState(false)

  // Modal Adjust Shooting
  const [shootModal, setShootModal] = useState(false)
  const [shootInputFile, setShootInputFile] = useState('')
  const [shootOutputFile, setShootOutputFile] = useState('1_face.png')
  const [shootPrompt, setShootPrompt] = useState('')
  const [shootModel, setShootModel] = useState<'pro' | 'flash'>('pro')
  const [shootRunning, setShootRunning] = useState(false)
  const [shootLogs, setShootLogs] = useState<BatchEvent[]>([])
  const [showShootLog, setShowShootLog] = useState(false)

  const load = useCallback(async () => {
    const d = await api.get(`/brands/${encodeURIComponent(brandName)}/refs/${encodeURIComponent(refName)}`)
    setData(d)
  }, [brandName, refName])

  const loadCampaignImages = useCallback(async () => {
    try {
      const imgs = await api.get(`/campaign/${encodeURIComponent(brandName)}/${encodeURIComponent(refName)}/list`)
      setCampImages(imgs)
    } catch { setCampImages([]) }
  }, [brandName, refName])

  useEffect(() => { load() }, [load])
  useEffect(() => { if (tab === 'campaign') loadCampaignImages() }, [tab, loadCampaignImages])
  useEffect(() => {
    if (tab === 'campaign' && campScenePresets.length === 0) {
      api.get(`/campaign/${encodeURIComponent(brandName)}/${encodeURIComponent(refName)}/scenes`)
        .then((s: ScenePreset[]) => setCampScenePresets(s.filter(p => p.key !== 'custom')))
        .catch(() => {})
    }
  }, [tab, brandName, refName, campScenePresets.length])

  // Sync adjustTarget quand selectedImg change
  useEffect(() => {
    if (selectedImg) { setAdjustTarget(selectedImg); setAdjustTargetDir('output') }
  }, [selectedImg])

  // Auto-select first face image as campaign source
  useEffect(() => {
    if (data?.images.length && !campSourceImg) {
      const face = data.images.find(i => i.includes('face')) || data.images[0]
      setCampSourceImg(face)
    }
  }, [data])

  const deleteImage = async (img: string) => {
    if (!confirm(`Supprimer ${img} ?`)) return
    await api.delete(`/manage/${encodeURIComponent(brandName)}/${encodeURIComponent(refName)}/${encodeURIComponent(img)}`)
    if (selectedImg === img) setSelectedImg(null)
    await load()
  }

  const deleteCampaignImage = async (img: string) => {
    if (!confirm(`Supprimer ${img} ?`)) return
    await api.delete(`/campaign/${encodeURIComponent(brandName)}/${encodeURIComponent(refName)}/${encodeURIComponent(img)}`)
    await loadCampaignImages()
  }

  const uploadToHero = async () => {
    if (!heroForm) return
    const { img, title, subtitle, buttonLink } = heroForm
    setHeroUploading(img)
    setHeroForm(null)
    try {
      await api.post(
        `/hero/upload?brand=${encodeURIComponent(brandName)}&ref=${encodeURIComponent(refName)}&filename=${encodeURIComponent(img)}&title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}&buttonLink=${encodeURIComponent(buttonLink)}`,
        {}
      )
      setHeroUploaded(prev => ({ ...prev, [img]: true }))
    } catch (e: any) {
      alert(`Erreur upload hero: ${e?.message ?? e}`)
    } finally {
      setHeroUploading(null)
    }
  }

  const streamSSE = (
    url: string,
    body: object,
    setLogs: React.Dispatch<React.SetStateAction<BatchEvent[]>>,
    setRunning: (v: boolean) => void,
    onDone?: () => void,
  ) => {
    setLogs([])
    setRunning(true)
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(async res => {
      const reader = res.body!.getReader()
      const dec = new TextDecoder()
      let buf = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })
        const lines = buf.split('\n'); buf = lines.pop()!
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const evt: BatchEvent = JSON.parse(line.slice(6))
            setLogs(prev => [...prev, evt])
            if (evt.type === 'done' || evt.type === 'error') {
              setRunning(false)
              onDone?.()
            }
          } catch {}
        }
      }
      setRunning(false)
    }).catch(e => {
      setLogs(prev => [...prev, { type: 'error', message: String(e) }])
      setRunning(false)
    })
  }

  const runAdjust = () => {
    if (!adjustTarget || !adjustPrompt.trim() || adjustRunning) return
    streamSSE(
      `/api/adjust/${encodeURIComponent(brandName)}/${encodeURIComponent(refName)}/${encodeURIComponent(adjustTarget)}`,
      { prompt: adjustPrompt, model: adjustModel, ref_image: adjustRef !== 'none' ? adjustRef : null, overwrite: adjustOverwrite },
      setAdjustLogs,
      setAdjustRunning,
      load,
    )
  }

  const [pilRunning, setPilRunning] = useState<string | null>(null)
  const [imgTs, setImgTs] = useState<number>(Date.now())
  const runPil = async (action: 'flip' | 'cadrage') => {
    if (!adjustTarget || pilRunning) return
    setPilRunning(action)
    try {
      await api.post(`/pil/${encodeURIComponent(brandName)}/${encodeURIComponent(refName)}/${encodeURIComponent(adjustTarget)}/${action}`)
      setImgTs(Date.now())
      await load()
    } finally {
      setPilRunning(null)
    }
  }

  const runBatch2 = () => {
    if (batch2Running) return
    setShowBatch2Log(true)
    streamSSE(
      `/api/batch2/${encodeURIComponent(brandName)}/${encodeURIComponent(refName)}/run`,
      {},
      setBatch2Logs,
      setBatch2Running,
      () => { setImgTs(Date.now()); load() },
    )
  }

  const runUpload = () => {
    if (uploadRunning) return
    setShowUploadLog(true)
    streamSSE(
      `/api/upload/${encodeURIComponent(brandName)}/${encodeURIComponent(refName)}/run`,
      {},
      setUploadLogs,
      setUploadRunning,
      load,
    )
  }

  const runGenerate = async (params?: { use_flash: boolean; flash_attempts: number; delay: number; skip_existing: boolean }) => {
    if (genRunning) return
    setGenModal(false)
    setGenLogs([]); setGenRunning(true); setShowGenLog(true)
    await api.post('/batch/start', {
      brand: brandName,
      skip_existing: params?.skip_existing ?? false,
      target_refs: [refName],
      use_flash: params?.use_flash ?? true,
      flash_attempts: params?.flash_attempts ?? 4,
      delay: params?.delay ?? 30,
    })
    const es = new EventSource('/api/batch/stream')
    esRef.current = es
    es.onmessage = (e) => {
      try {
        const evt: BatchEvent = JSON.parse(e.data)
        setGenLogs(prev => [...prev, evt])
        if (evt.type === 'batch_done' || evt.type === 'stopped' || evt.type === 'error') {
          setGenRunning(false); es.close(); load()
        }
      } catch {}
    }
    es.onerror = () => { setGenRunning(false); es.close() }
  }

  const runShootingAdjust = () => {
    if (!shootInputFile || !shootPrompt.trim() || shootRunning) return
    setShootModal(false)
    setShowShootLog(true)
    streamSSE(
      `/api/adjust/${encodeURIComponent(brandName)}/${encodeURIComponent(refName)}/${encodeURIComponent(shootInputFile)}`,
      { prompt: shootPrompt, model: shootModel, ref_image: null, overwrite: false, output_filename: shootOutputFile },
      setShootLogs,
      setShootRunning,
      load,
    )
  }

  const runCampaign = (done = 0) => {
    if (!campSourceImg || campRunningRef.current) return
    campRunningRef.current = true
    setCampRunning(true)
    setCampProgress([done, campCount])
    fetch(`/api/campaign/${encodeURIComponent(brandName)}/${encodeURIComponent(refName)}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_image: campSourceImg, scene: 'custom', custom_prompt: campCustomPrompt, model: campModel }),
    }).then(async res => {
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buf = ''
      while (true) {
        const { done: streamDone, value } = await reader.read()
        if (streamDone) break
        buf += decoder.decode(value, { stream: true })
        const lines = buf.split('\n')
        buf = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data:')) continue
          try {
            const evt: BatchEvent = JSON.parse(line.slice(5).trim())
            setCampLogs(prev => [...prev, evt])
            if (evt.type === 'done' || evt.type === 'error') {
              campRunningRef.current = false
              setCampRunning(false)
              loadCampaignImages()
              const nextDone = done + 1
              if (nextDone < campCount) {
                setCampProgress([nextDone, campCount])
                setTimeout(() => runCampaign(nextDone), 400)
              } else {
                setCampProgress([0, 0])
              }
            }
          } catch {}
        }
      }
      campRunningRef.current = false
      setCampRunning(false)
    }).catch(() => {
      campRunningRef.current = false
      setCampRunning(false)
    })
  }

  const runCampAdjust = () => {
    if (!campAdjustImg || !campAdjustPrompt.trim() || campAdjustRunning) return
    streamSSE(
      `/api/adjust/${encodeURIComponent(brandName)}/${encodeURIComponent(refName)}/campaign/${encodeURIComponent(campAdjustImg)}`,
      { prompt: campAdjustPrompt, model: campAdjustModel, ref_image: null, overwrite: true },
      setCampAdjustLogs,
      setCampAdjustRunning,
      loadCampaignImages,
    )
  }

  if (!data) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-4 h-4 border border-zinc-700 border-t-zinc-400 rounded-full animate-spin" />
    </div>
  )

  const hasImages = data.images.length > 0

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800/60 px-8 py-4 sticky top-0 z-10 bg-zinc-950/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <Link to={`/brand/${encodeURIComponent(brandName)}`}
            className="inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-zinc-600 hover:text-zinc-300 mb-3 transition-colors cursor-pointer">
            <ChevronLeft size={11} />{brandName}
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-semibold text-zinc-100 tracking-tight">{refName}</h1>
              <div className="mt-1.5 flex items-center gap-2">
                <StatusBadge status={data.status} />
                <span className="text-[10px] text-zinc-600">{data.images.length} image{data.images.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={load} className="p-2 text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer rounded-lg hover:bg-zinc-800">
                <RefreshCw size={13} />
              </button>
              {data.input_photo_count > 0 && (
                <button
                  onClick={() => {
                    setShootInputFile(data.input_photos?.[0] ?? '')
                    setShootOutputFile('1_face.png')
                    setShootPrompt('Remove background completely, replace with solid plain #F3F3F3 light grey. Center the product on the canvas with even margins on all sides. Preserve all product colors, textures, logos and details exactly.')
                    setShootModal(true)
                  }}
                  disabled={shootRunning}
                  className="flex items-center gap-2 text-[11px] font-medium border border-zinc-700 hover:border-zinc-600 text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded-lg transition-all disabled:opacity-40 cursor-pointer">
                  <Zap size={12} />{shootRunning ? 'Adjust…' : 'Adjust shooting'}
                </button>
              )}
              {data.status === 'needs_generation' && (
                <button onClick={() => setGenModal(true)} disabled={genRunning}
                  className="flex items-center gap-2 text-[11px] font-medium border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg transition-all disabled:opacity-40 cursor-pointer">
                  <Play size={12} />{genRunning ? 'Génération…' : 'Générer'}
                </button>
              )}
              {hasImages && (
                <button onClick={runBatch2} disabled={batch2Running}
                  className="flex items-center gap-2 text-[11px] font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg transition-all disabled:opacity-40 cursor-pointer">
                  <Play size={12} />{batch2Running ? 'Batch 2…' : 'Batch 2'}
                </button>
              )}
              {(data.status === 'needs_upload' || data.status === 'done') && hasImages && (
                <button onClick={runUpload} disabled={uploadRunning}
                  className="flex items-center gap-2 text-[11px] font-medium bg-white hover:bg-zinc-100 text-black px-4 py-1.5 rounded-lg transition-all disabled:opacity-40 cursor-pointer">
                  <Upload size={12} />{uploadRunning ? 'Upload…' : 'Uploader'}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-6">
        {/* Logs */}
        {showGenLog && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] tracking-widest uppercase text-zinc-500 font-medium">{genRunning ? 'Génération…' : 'Terminé'}</span>
              {!genRunning && <button onClick={() => setShowGenLog(false)} className="text-zinc-600 hover:text-zinc-300 cursor-pointer"><X size={13} /></button>}
            </div>
            <LogConsole events={genLogs} />
          </div>
        )}
        {showShootLog && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] tracking-widest uppercase text-zinc-500 font-medium">{shootRunning ? 'Adjust shooting…' : 'Terminé'}</span>
              {!shootRunning && <button onClick={() => setShowShootLog(false)} className="text-zinc-600 hover:text-zinc-300 cursor-pointer"><X size={13} /></button>}
            </div>
            <LogConsole events={shootLogs} />
          </div>
        )}
        {showUploadLog && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] tracking-widest uppercase text-zinc-500 font-medium">{uploadRunning ? 'Upload…' : 'Terminé'}</span>
              {!uploadRunning && <button onClick={() => setShowUploadLog(false)} className="text-zinc-600 hover:text-zinc-300 cursor-pointer"><X size={13} /></button>}
            </div>
            <LogConsole events={uploadLogs} />
          </div>
        )}
        {showBatch2Log && (
          <div className="bg-zinc-900 border border-indigo-900/40 rounded-xl p-4 mb-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] tracking-widest uppercase text-indigo-400 font-medium">{batch2Running ? 'Batch 2 — Fond blanc + ombre…' : 'Batch 2 terminé'}</span>
              {!batch2Running && <button onClick={() => setShowBatch2Log(false)} className="text-zinc-600 hover:text-zinc-300 cursor-pointer"><X size={13} /></button>}
            </div>
            <LogConsole events={batch2Logs} />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-zinc-800/60 pb-0">
          {[
            { key: 'images' as TabMode,   label: 'Images produit', icon: <Sparkles size={11} /> },
            { key: 'campaign' as TabMode, label: 'Campagne IA',    icon: <Clapperboard size={11} /> },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 text-[11px] font-medium tracking-wide px-4 py-2.5 border-b-2 transition-all cursor-pointer -mb-px ${
                tab === t.key
                  ? 'border-white text-white'
                  : 'border-transparent text-zinc-600 hover:text-zinc-400'
              }`}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* ── Tab Images ── */}
        {tab === 'images' && (
          !hasImages ? (
            <div className="text-center py-24">
              <p className="text-zinc-600 text-sm">
                {data.input_photo_count > 0 ? 'Photos présentes · lancer la génération' : 'Aucune photo dans ce dossier'}
              </p>
            </div>
          ) : (
            <div className={`grid gap-6 items-start ${selectedImg ? 'grid-cols-[1fr_320px]' : ''}`}>
              {/* Image grid */}
              <div className={`grid gap-4 items-start ${selectedImg ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                {data.images.map(img => (
                  <div
                    key={img}
                    onClick={() => setSelectedImg(selectedImg === img ? null : img)}
                    className={`group bg-zinc-900 border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
                      selectedImg === img ? 'border-white ring-1 ring-white/20' : 'border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <div className="aspect-[3/4] bg-zinc-800 overflow-hidden">
                      <img
                        src={`/api/images/${encodeURIComponent(brandName)}/${encodeURIComponent(refName)}/${img}?t=${imgTs}`}
                        alt={img}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="px-3 py-2 flex items-center justify-between">
                      <p className="text-[10px] text-zinc-500 font-mono truncate">{img}</p>
                      <button
                        onClick={e => { e.stopPropagation(); deleteImage(img) }}
                        className="text-zinc-700 hover:text-red-400 transition-colors ml-2 flex-shrink-0 cursor-pointer opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Adjust panel */}
              {selectedImg && (
                <div className="w-80">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sticky top-24 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles size={13} className="text-zinc-400" />
                        <span className="text-xs font-medium text-zinc-200">Ajuster</span>
                      </div>
                      <button onClick={() => setSelectedImg(null)} className="text-zinc-600 hover:text-zinc-300 cursor-pointer">
                        <X size={14} />
                      </button>
                    </div>

                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-zinc-600 mb-1.5">Cible</p>
                      {/* Onglets Output / Input (shooting) */}
                      <div className="flex gap-1 mb-2">
                        {(['output', 'input'] as const).map(dir => (
                          <button key={dir} onClick={() => {
                            setAdjustTargetDir(dir)
                            const list = dir === 'output' ? data.images : (data.input_photos ?? [])
                            if (list.length) setAdjustTarget(list[0])
                          }}
                            className={`flex-1 text-[9px] font-medium py-1 rounded-md border transition-all cursor-pointer ${
                              adjustTargetDir === dir ? 'bg-zinc-100 text-black border-zinc-100' : 'border-zinc-700 text-zinc-500 hover:border-zinc-500'
                            }`}>
                            {dir === 'output' ? 'Générées' : 'Shooting'}
                          </button>
                        ))}
                      </div>
                      <select value={adjustTarget} onChange={e => setAdjustTarget(e.target.value)}
                        className="w-full text-[11px] bg-zinc-800 border border-zinc-700 text-zinc-300 px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-zinc-500 cursor-pointer">
                        {(adjustTargetDir === 'output' ? data.images : (data.input_photos ?? [])).map(i => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                    </div>

                    <div className="aspect-square bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700/50">
                      <img
                        src={(adjustTargetDir === 'output'
                          ? `/api/images/${encodeURIComponent(brandName)}/${encodeURIComponent(refName)}/${adjustTarget}`
                          : `/api/images/${encodeURIComponent(brandName)}/${encodeURIComponent(refName)}/input/${adjustTarget}`) + `?t=${imgTs}`}
                        alt={adjustTarget}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-zinc-600 mb-1.5">PIL</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button onClick={() => runPil('cadrage')} disabled={!adjustTarget || !!pilRunning}
                          className="flex items-center justify-center gap-1.5 text-[10px] font-medium py-2 rounded-lg border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 disabled:opacity-30 transition-all cursor-pointer">
                          <Crop size={11} />
                          {pilRunning === 'cadrage' ? '…' : 'Cadrage'}
                        </button>
                        <button onClick={() => runPil('flip')} disabled={!adjustTarget || !!pilRunning}
                          className="flex items-center justify-center gap-1.5 text-[10px] font-medium py-2 rounded-lg border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 disabled:opacity-30 transition-all cursor-pointer">
                          <FlipHorizontal2 size={11} />
                          {pilRunning === 'flip' ? '…' : 'Flip'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-zinc-600 mb-2">Presets</p>
                      <div className="flex flex-wrap gap-1.5">
                        {ADJUST_PRESETS.map(p => (
                          <button key={p.label} onClick={() => setAdjustPrompt(p.prompt)}
                            className="text-[9px] font-medium tracking-wide uppercase px-2.5 py-1 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 rounded-md transition-all cursor-pointer">
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-zinc-600 mb-1.5">Prompt</p>
                      <textarea
                        value={adjustPrompt}
                        onChange={e => setAdjustPrompt(e.target.value)}
                        rows={3}
                        placeholder="Describe the adjustment…"
                        className="w-full text-[11px] bg-zinc-800 border border-zinc-700 text-zinc-200 placeholder-zinc-700 px-3 py-2 rounded-lg resize-none focus:outline-none focus:border-zinc-500 transition-colors"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      />
                    </div>

                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-zinc-600 mb-1.5">Modèle</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {(['pro', 'flash'] as const).map(m => (
                          <button key={m} onClick={() => setAdjustModel(m)}
                            className={`text-[10px] font-medium py-1.5 rounded-lg border transition-all cursor-pointer ${
                              adjustModel === m ? 'bg-zinc-100 text-black border-zinc-100' : 'border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                            }`}>
                            {m === 'pro' ? 'Pro' : 'Flash'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-zinc-600 mb-1.5">Image ref</p>
                      <select value={adjustRef} onChange={e => setAdjustRef(e.target.value)}
                        className="w-full text-[11px] bg-zinc-800 border border-zinc-700 text-zinc-300 px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-zinc-500 cursor-pointer">
                        <option value="none">Aucune</option>
                        {data.images.filter(i => i !== selectedImg).map(i => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                        {brandAssets.length > 0 && (
                          <optgroup label="── Assets marque ──">
                            {brandAssets.map(a => (
                              <option key={a} value={a}>📌 {a}</option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                    </div>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={adjustOverwrite} onChange={e => setAdjustOverwrite(e.target.checked)}
                        className="w-3.5 h-3.5 accent-white cursor-pointer" />
                      <span className="text-[10px] font-medium text-zinc-500 tracking-wide">Écraser l'original</span>
                    </label>

                    <button onClick={runAdjust} disabled={!adjustTarget || !adjustPrompt.trim() || adjustRunning}
                      className="w-full flex items-center justify-center gap-2 text-[11px] font-medium bg-white hover:bg-zinc-100 text-black py-2.5 rounded-lg transition-all disabled:opacity-30 cursor-pointer">
                      <Wand2 size={12} />
                      {adjustRunning ? 'Ajustement…' : 'Lancer Adjust'}
                    </button>

                    {adjustLogs.length > 0 && <LogConsole events={adjustLogs} />}
                  </div>
                </div>
              )}
            </div>
          )
        )}

        {/* ── Tab Campaign ── */}
        {tab === 'campaign' && (
          <div className="grid grid-cols-[320px_1fr] gap-6">

            {/* Panel gauche — configurateur */}
            <div className="space-y-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-5">
                <div className="flex items-center gap-2">
                  <Clapperboard size={13} className="text-zinc-400" />
                  <span className="text-xs font-medium text-zinc-200">Générer une campagne</span>
                </div>

                {/* Source image */}
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-zinc-600 mb-2">Image source</p>
                  {hasImages ? (
                    <div className="grid grid-cols-3 gap-1.5">
                      {data.images.map(img => (
                        <button
                          key={img}
                          onClick={() => setCampSourceImg(img)}
                          className={`relative aspect-square bg-zinc-800 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                            campSourceImg === img ? 'border-white ring-1 ring-white/20' : 'border-zinc-700 hover:border-zinc-500'
                          }`}
                        >
                          <img
                            src={`/api/images/${encodeURIComponent(brandName)}/${encodeURIComponent(refName)}/${img}`}
                            alt={img}
                            className="w-full h-full object-contain"
                          />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-zinc-600">Aucune image produit disponible</p>
                  )}
                </div>

                {/* Presets */}
                {campScenePresets.length > 0 && (
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-zinc-600 mb-1.5">Presets</p>
                    <div className="flex flex-wrap gap-1.5">
                      {campScenePresets.map(p => (
                        <button key={p.key} onClick={() => setCampCustomPrompt(p.raw_prompt)}
                          className="text-[9px] font-medium tracking-wide uppercase px-2.5 py-1 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 rounded-md transition-all cursor-pointer">
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prompt */}
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-zinc-600 mb-1.5">Prompt</p>
                  <textarea
                    value={campCustomPrompt}
                    onChange={e => setCampCustomPrompt(e.target.value)}
                    rows={8}
                    placeholder="Colle ici le prompt ou sélectionne un preset ci-dessus…"
                    className="w-full text-[11px] bg-zinc-800 border border-zinc-700 text-zinc-200 placeholder-zinc-600 px-3 py-2 rounded-lg resize-none focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>

                {/* Model */}
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-zinc-600 mb-1.5">Modèle</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['pro', 'flash'] as const).map(m => (
                      <button key={m} onClick={() => setCampModel(m)}
                        className={`text-[10px] font-medium py-1.5 rounded-lg border transition-all cursor-pointer ${
                          campModel === m ? 'bg-zinc-100 text-black border-zinc-100' : 'border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                        }`}>
                        {m === 'pro' ? 'Pro' : 'Flash'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantité */}
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-zinc-600 mb-1.5">Quantité</p>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} onClick={() => setCampCount(n)}
                        className={`flex-1 text-[11px] font-medium py-1.5 rounded-lg border transition-all cursor-pointer ${
                          campCount === n ? 'bg-zinc-100 text-black border-zinc-100' : 'border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                        }`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate */}
                <button
                  onClick={() => runCampaign(0)}
                  disabled={!campSourceImg || campRunning || !campCustomPrompt.trim()}
                  className="w-full flex items-center justify-center gap-2 text-[11px] font-medium bg-white hover:bg-zinc-100 text-black py-2.5 rounded-lg transition-all disabled:opacity-30 cursor-pointer"
                >
                  <Zap size={12} />
                  {campRunning
                    ? campProgress[1] > 1 ? `Génération ${campProgress[0] + 1}/${campProgress[1]}…` : 'Génération…'
                    : campCount > 1 ? `Générer ×${campCount}` : 'Générer la campagne'}
                </button>

                {/* Logs */}
                {campLogs.length > 0 && (
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-zinc-600 mb-1.5">Logs</p>
                    <LogConsole events={campLogs} />
                  </div>
                )}
              </div>
            </div>

            {/* Panneau droit — résultats + adjust */}
            <div className={campAdjustImg ? 'grid grid-cols-[1fr_280px] gap-4' : ''}>
              {campImages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Clapperboard size={32} className="text-zinc-800 mb-3" />
                  <p className="text-zinc-600 text-sm">Aucune image de campagne générée</p>
                  <p className="text-zinc-700 text-xs mt-1">Configure une scène et lance la génération</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {campImages.map(img => (
                    <div key={img} className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                      <div className="aspect-video bg-zinc-800 overflow-hidden cursor-zoom-in" onClick={() => setLightboxSrc(`/api/images/${encodeURIComponent(brandName)}/${encodeURIComponent(refName)}/campaign/${img}`)}>
                        <img
                          src={`/api/images/${encodeURIComponent(brandName)}/${encodeURIComponent(refName)}/campaign/${img}`}
                          alt={img}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="px-3 py-2 flex items-center justify-between gap-2">
                        <p className="text-[9px] text-zinc-600 font-mono truncate flex-1">{img}</p>
                        <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {heroUploaded[img] ? (
                            <span className="flex items-center gap-1 text-[9px] text-emerald-400">
                              <Check size={10} /> Ajouté
                            </span>
                          ) : (
                            <button
                              onClick={() => setHeroForm({ img, title: 'SS26 Pre Release', subtitle: `${brandName} SS26`, buttonLink: '/catalog' })}
                              disabled={heroUploading === img}
                              className="flex items-center gap-1 text-[9px] text-zinc-400 hover:text-white cursor-pointer disabled:opacity-40"
                            >
                              <CloudUpload size={10} />
                              <span>{heroUploading === img ? '…' : 'Hero'}</span>
                            </button>
                          )}
                          <button onClick={() => { setCampAdjustImg(img === campAdjustImg ? null : img); setCampAdjustLogs([]) }}
                            className={`flex items-center gap-1 text-[9px] transition-colors cursor-pointer ${campAdjustImg === img ? 'text-white' : 'text-zinc-400 hover:text-white'}`}>
                            <Wand2 size={10} />
                          </button>
                          <button onClick={() => deleteCampaignImage(img)} className="text-zinc-700 hover:text-red-400 transition-colors cursor-pointer">
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Panel adjust campagne */}
            {campAdjustImg && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sticky top-24 space-y-3 self-start">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-zinc-200 flex items-center gap-1.5"><Wand2 size={11} /> Ajuster</span>
                  <button onClick={() => setCampAdjustImg(null)} className="text-zinc-600 hover:text-zinc-300 cursor-pointer"><X size={13} /></button>
                </div>
                <div className="aspect-video bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700/50">
                  <img src={`/api/images/${encodeURIComponent(brandName)}/${encodeURIComponent(refName)}/campaign/${campAdjustImg}`} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ADJUST_PRESETS.map(p => (
                    <button key={p.label} onClick={() => setCampAdjustPrompt(p.prompt)}
                      className="text-[9px] font-medium tracking-wide uppercase px-2.5 py-1 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 rounded-md transition-all cursor-pointer">
                      {p.label}
                    </button>
                  ))}
                </div>
                <textarea
                  value={campAdjustPrompt}
                  onChange={e => setCampAdjustPrompt(e.target.value)}
                  rows={4}
                  placeholder="Décris l'ajustement…"
                  className="w-full text-[11px] bg-zinc-800 border border-zinc-700 text-zinc-200 placeholder-zinc-600 px-3 py-2 rounded-lg resize-none focus:outline-none focus:border-zinc-500 transition-colors"
                />
                <div className="grid grid-cols-2 gap-1.5">
                  {(['pro', 'flash'] as const).map(m => (
                    <button key={m} onClick={() => setCampAdjustModel(m)}
                      className={`text-[10px] font-medium py-1.5 rounded-lg border transition-all cursor-pointer ${campAdjustModel === m ? 'bg-zinc-100 text-black border-zinc-100' : 'border-zinc-700 text-zinc-500 hover:border-zinc-500'}`}>
                      {m === 'pro' ? 'Pro' : 'Flash'}
                    </button>
                  ))}
                </div>
                <button onClick={runCampAdjust} disabled={!campAdjustPrompt.trim() || campAdjustRunning}
                  className="w-full flex items-center justify-center gap-2 text-[11px] font-medium bg-white hover:bg-zinc-100 text-black py-2 rounded-lg transition-all disabled:opacity-30 cursor-pointer">
                  <Wand2 size={11} />
                  {campAdjustRunning ? 'Ajustement…' : 'Ajuster (écrase)'}
                </button>
                {campAdjustLogs.length > 0 && <LogConsole events={campAdjustLogs} />}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal Générer */}
      {genModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setGenModal(false)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-sm mx-4 space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-medium text-white flex items-center gap-2"><Play size={14} /> Générer</h3>

            <div>
              <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-2">Modèle</p>
              <div className="grid grid-cols-2 gap-2">
                {(['flash', 'pro'] as const).map(m => (
                  <button key={m} onClick={() => setGenModalModel(m)}
                    className={`text-[11px] font-medium py-2 rounded-lg border transition-all cursor-pointer ${genModalModel === m ? 'bg-zinc-100 text-black border-zinc-100' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}>
                    {m === 'pro' ? 'Pro (qualité)' : 'Flash (rapide)'}
                  </button>
                ))}
              </div>
            </div>

            {genModalModel === 'flash' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-1.5">Tentatives Flash</p>
                  <input type="number" min={1} max={10} value={genModalAttempts} onChange={e => setGenModalAttempts(+e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg px-3 py-1.5 text-[11px] outline-none focus:border-zinc-500" />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-1.5">Délai (s)</p>
                  <input type="number" min={0} max={120} value={genModalDelay} onChange={e => setGenModalDelay(+e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg px-3 py-1.5 text-[11px] outline-none focus:border-zinc-500" />
                </div>
              </div>
            )}

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={genModalSkip} onChange={e => setGenModalSkip(e.target.checked)} className="w-3.5 h-3.5 accent-white cursor-pointer" />
              <span className="text-[10px] text-zinc-500">Skip si images existantes</span>
            </label>

            <div className="flex gap-2 pt-1">
              <button onClick={() => setGenModal(false)} className="flex-1 py-2 rounded-lg text-xs text-zinc-400 border border-zinc-700 hover:bg-zinc-800 cursor-pointer">Annuler</button>
              <button onClick={() => runGenerate({ use_flash: genModalModel === 'flash', flash_attempts: genModalAttempts, delay: genModalDelay, skip_existing: genModalSkip })}
                className="flex-1 py-2 rounded-lg text-xs text-white bg-white/10 hover:bg-white/20 border border-zinc-600 cursor-pointer flex items-center justify-center gap-1.5">
                <Play size={11} /> Lancer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Adjust Shooting */}
      {shootModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShootModal(false)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-sm mx-4 space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-medium text-white flex items-center gap-2"><Zap size={14} /> Adjust depuis shooting</h3>
            <p className="text-[10px] text-zinc-500">Prend la photo brute, supprime le fond, centre le produit → sauvegarde dans les images générées.</p>

            <div>
              <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-1.5">Photo source (shooting)</p>
              <select value={shootInputFile} onChange={e => setShootInputFile(e.target.value)}
                className="w-full text-[11px] bg-zinc-800 border border-zinc-700 text-zinc-300 px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-zinc-500 cursor-pointer">
                {(data?.input_photos ?? []).map(f => <option key={f} value={f}>{f}</option>)}
                {(data?.input_photos ?? []).length === 0 && <option value="">Aucune photo de shooting</option>}
              </select>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-1.5">Nom fichier output</p>
              <div className="flex gap-1.5 mb-2 flex-wrap">
                {['1_face.png', '2_back.png', '3_detail.png'].map(f => (
                  <button key={f} onClick={() => setShootOutputFile(f)}
                    className={`text-[9px] font-medium px-2.5 py-1 rounded-md border transition-all cursor-pointer ${shootOutputFile === f ? 'bg-zinc-100 text-black border-zinc-100' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}>
                    {f}
                  </button>
                ))}
              </div>
              <input value={shootOutputFile} onChange={e => setShootOutputFile(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg px-3 py-1.5 text-[11px] outline-none focus:border-zinc-500" />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-1.5">Modèle</p>
              <div className="grid grid-cols-2 gap-2">
                {(['pro', 'flash'] as const).map(m => (
                  <button key={m} onClick={() => setShootModel(m)}
                    className={`text-[11px] font-medium py-1.5 rounded-lg border transition-all cursor-pointer ${shootModel === m ? 'bg-zinc-100 text-black border-zinc-100' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}>
                    {m === 'pro' ? 'Pro' : 'Flash'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-1.5">Presets</p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {ADJUST_PRESETS.filter(p => ['Default', 'Flat lay', 'Fond'].includes(p.label)).map(p => (
                  <button key={p.label} onClick={() => setShootPrompt(p.prompt)}
                    className="text-[9px] font-medium tracking-wide uppercase px-2.5 py-1 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 rounded-md transition-all cursor-pointer">
                    {p.label}
                  </button>
                ))}
                <button onClick={() => setShootPrompt('Remove background completely, replace with solid plain #F3F3F3 light grey. Center the product on the canvas with even margins on all sides. Preserve all product colors, textures, logos and details exactly.')}
                  className="text-[9px] font-medium tracking-wide uppercase px-2.5 py-1 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 rounded-md transition-all cursor-pointer">
                  Remove BG
                </button>
              </div>
              <textarea value={shootPrompt} onChange={e => setShootPrompt(e.target.value)} rows={3}
                placeholder="Describe l'ajustement…"
                className="w-full text-[11px] bg-zinc-800 border border-zinc-700 text-zinc-200 placeholder-zinc-600 px-3 py-2 rounded-lg resize-none focus:outline-none focus:border-zinc-500 transition-colors" />
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={() => setShootModal(false)} className="flex-1 py-2 rounded-lg text-xs text-zinc-400 border border-zinc-700 hover:bg-zinc-800 cursor-pointer">Annuler</button>
              <button onClick={runShootingAdjust} disabled={!shootInputFile || !shootPrompt.trim()}
                className="flex-1 py-2 rounded-lg text-xs text-white bg-white/10 hover:bg-white/20 border border-zinc-600 disabled:opacity-30 cursor-pointer flex items-center justify-center gap-1.5">
                <Zap size={11} /> Lancer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 cursor-zoom-out"
          onClick={() => setLightboxSrc(null)}
        >
          <img
            src={lightboxSrc}
            alt=""
            className="max-w-[95vw] max-h-[95vh] object-contain rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors cursor-pointer"
            onClick={() => setLightboxSrc(null)}
          >
            <X size={24} />
          </button>
        </div>
      )}

      {/* Modal Hero Form */}
      {heroForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-sm mx-4 space-y-4">
            <h3 className="text-sm font-medium text-white">Ajouter au Hero</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Titre</label>
                <input
                  className="mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-zinc-500"
                  value={heroForm.title}
                  onChange={e => setHeroForm(f => f ? { ...f, title: e.target.value } : f)}
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Subtitle</label>
                <input
                  className="mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-zinc-500"
                  value={heroForm.subtitle}
                  onChange={e => setHeroForm(f => f ? { ...f, subtitle: e.target.value } : f)}
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Lien bouton</label>
                <input
                  className="mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-zinc-500"
                  value={heroForm.buttonLink}
                  onChange={e => setHeroForm(f => f ? { ...f, buttonLink: e.target.value } : f)}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setHeroForm(null)}
                className="flex-1 py-2 rounded-lg text-xs text-zinc-400 border border-zinc-700 hover:bg-zinc-800 cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={uploadToHero}
                className="flex-1 py-2 rounded-lg text-xs text-white bg-white/10 hover:bg-white/20 border border-zinc-600 cursor-pointer"
              >
                <CloudUpload size={12} className="inline mr-1" /> Uploader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
