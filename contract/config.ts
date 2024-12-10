import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'

// @ts-ignore
export const config = createConfig({
  chains: [sepolia],
  connectors: [metaMask({
    dappMetadata: { 
      name: 'Doctelligence Contributor', 
      url: 'https://contributor.doctelligence.com/', 
      iconUrl: 'https://contributor.doctelligence.com/favicon.svg', 
    },
  })],
  transports: {
    [sepolia.id]: http(),
  },
});

export const CONTRACT_ADDRESS = '0x085b721dA12D70115B275174743dF90A1E3e44B4';
