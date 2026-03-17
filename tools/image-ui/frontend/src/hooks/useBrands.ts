import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'
import { BrandStats } from '../types'

export function useBrands() {
  const [brands, setBrands] = useState<BrandStats[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await api.get('/brands')
    setBrands(data)
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])
  return { brands, loading, refresh }
}
