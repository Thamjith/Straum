import { useNavigate } from 'react-router-dom'
import { paths } from '@/lib/routes'
import { useApp } from '@/context/app-context'
import { AppHome } from '@/components/app-shell/app-home'

export function AppHomePage() {
  const navigate = useNavigate()
  const { peers } = useApp()

  return (
    <AppHome
      peers={peers}
      onPair={() => navigate(paths.appPair)}
      onOpenChat={(id) => navigate(paths.appChat(id))}
    />
  )
}
