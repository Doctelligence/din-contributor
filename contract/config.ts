import { http, createConfig, cookieStorage, createStorage } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'

export const config = createConfig({
  ssr: true,
  chains: [sepolia, mainnet],
  connectors: [metaMask({
    dappMetadata: { 
      name: 'Doctelligence Contributor', 
      url: 'https://contributor.doctelligence.com/', 
      iconUrl: 'https://contributor.doctelligence.com/favicon.svg', 
    },
  })],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
  // storage: createStorage({
  //   storage: cookieStorage,
  // }),
});

export const CONTRACT_ADDRESS = '0xe44706D243C504aF2383B2eF97Fb63e32C6C4679';
