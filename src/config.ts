import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

// @ts-ignore
export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

