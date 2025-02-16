'use client'

import { useAppKitTheme } from '@reown/appkit/react'
import { ActionButtonList } from '@/components/ActionButtonList'
import { Footer } from '@/components/Footer'
import Home from '@/pages/Home'

export default function Page() {

  const { themeMode } = useAppKitTheme()
  
  return (
    <div className="page-container">
    <div className="logo-container">
      <img
        src={themeMode === 'dark' ? '/reown-logo-white.png' : '/reown-logo.png'}
        alt="Reown"
        width="150"
      />
      <img src="/appkit-logo.png" alt="Reown" width="150" />
    </div>

    <h1 className="page-title">DocuVerify with zkSync & TTS</h1>

    <div className="appkit-buttons-container">
      <appkit-button />
      <appkit-network-button />
    </div>
      <Home />
      <div>
      <ActionButtonList />
      <Footer />
      </div>
  </div>
  )
}
