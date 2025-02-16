import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { zksyncSepoliaTestnet } from 'viem/zksync'
import {
  createAppKit,
  useAppKit,
  useAppKitAccount,
  useAppKitEvents,
  useAppKitNetwork,
  useAppKitState,
  useAppKitTheme,
  useDisconnect,
  useWalletInfo
} from '@reown/appkit/react'

export const projectId = process.env.REOWN_PROJECT_ID || 'b56e18d47c72ab683b10814fe9495694' 

// Setup wagmi adapter
export const ethersAdapter = new EthersAdapter()

// Create modal
const modal = createAppKit({
  adapters: [ethersAdapter],
  networks: [zksyncSepoliaTestnet],
  metadata: {
    name: 'DocuVerify',
    description: 'Verifying Documents using zkSync & TTS',
    url: 'http://localhost:3000',
    icons: ['https://avatars.githubusercontent.com/u/179229932?s=200&v=4']
  },
  projectId,
  themeMode: 'light',
  features: {
    analytics: true
  }
})

export {
  modal,
  useAppKit,
  useAppKitState,
  useAppKitTheme,
  useAppKitEvents,
  useAppKitAccount,
  useWalletInfo,
  useAppKitNetwork,
  useDisconnect
}