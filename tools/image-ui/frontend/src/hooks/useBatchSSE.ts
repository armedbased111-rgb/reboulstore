import { useEffect, useRef } from 'react'
import { BatchEvent } from '../types'

export function useBatchSSE(onEvent: (e: BatchEvent) => void, active: boolean) {
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!active) return
    const es = new EventSource('/api/batch/stream')
    esRef.current = es
    es.onmessage = (e) => {
      const event = JSON.parse(e.data) as BatchEvent
      onEvent(event)
    }
    es.onerror = () => es.close()
    return () => {
      es.close()
      esRef.current = null
    }
  }, [active, onEvent])
}
