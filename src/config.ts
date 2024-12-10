import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

// @ts-ignore
export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});

export const CONTRACT_ADDRESS = '0x085b721dA12D70115B275174743dF90A1E3e44B4';
