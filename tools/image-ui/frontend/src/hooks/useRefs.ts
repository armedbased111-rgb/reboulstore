import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'
import { RefStatus } from '../types'

export function useRefs(brandName: string) {
  const [refs, setRefs] = useState<RefStatus[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await api.get(`/brands/${encodeURIComponent(brandName)}/refs`)
    setRefs(data)
    setLoading(false)
  }, [brandName])

  useEffect(() => { refresh() }, [refresh])
  return { refs, loading, refresh }
}
