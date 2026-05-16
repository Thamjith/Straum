import { Navigate, useParams } from 'react-router-dom'
import { normalizeHandshakeCode } from '@/lib/handshake'
import { paths } from '@/lib/routes'

/** Web fallback when a QR encodes straum://pair/CODE — opens accept flow. */
export function PairCodeRedirect() {
  const { code } = useParams<{ code: string }>()
  if (!code) return <Navigate to={paths.appPair} replace />
  const normalized = normalizeHandshakeCode(code) ?? code
  const params = new URLSearchParams({ mode: 'accept', code: normalized })
  return <Navigate to={`${paths.appPair}?${params.toString()}`} replace />
}
