import { createBrowserRouter } from 'react-router-dom'
import { AppProvider } from '@/context/app-context'
import { LandingLayout } from '@/layouts/landing-layout'
import { AppLayout } from '@/layouts/app-layout'
import { LandingPage } from '@/pages/landing-page'
import { AppHomePage } from '@/pages/app-home-page'
import { AppPairPage } from '@/pages/app-pair-page'
import { AppChatPage } from '@/pages/app-chat-page'
import { paths } from '@/lib/routes'
import { PairCodeRedirect } from '@/pages/pair-code-redirect'

export const router = createBrowserRouter([
  {
    element: <LandingLayout />,
    children: [
      { path: paths.home, element: <LandingPage /> },
      { path: paths.howItWorks, element: <LandingPage /> },
      { path: paths.features, element: <LandingPage /> },
      { path: paths.security, element: <LandingPage /> },
      { path: paths.open, element: <LandingPage /> },
    ],
  },
  { path: '/pair/:code', element: <PairCodeRedirect /> },
  {
    path: paths.app,
    element: (
      <AppProvider>
        <AppLayout />
      </AppProvider>
    ),
    children: [
      { index: true, element: <AppHomePage /> },
      { path: 'pair', element: <AppPairPage /> },
      { path: 'chat/:peerId', element: <AppChatPage /> },
    ],
  },
])
