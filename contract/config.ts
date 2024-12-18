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

export const mainnetConfig = createConfig({
  ssr: true,
  chains: [
    mainnet,
    // sepolia
  ],
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

// DINManagerModule#DINManager - 0xe44706D243C504aF2383B2eF97Fb63e32C6C4679
// MockERC20Module#MockERC20 - 0x41C9042Ab6f01CEfdc64021741Bbb36cce5B4584

export const CONTRACT_ADDRESS = '0xe44706D243C504aF2383B2eF97Fb63e32C6C4679';
export const MOCK_ERC20_ADDRESS = '0x41C9042Ab6f01CEfdc64021741Bbb36cce5B4584';
export const CONVERSION_ADDRESS_BTC_USD = '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c';
export const CONVERSION_ADDRESS_ETH_USD = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419';
export const CONVERSION_ADDRESS_LINK_USD = '0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c';
export const CONVERSION_ADDRESS_BNB_USD = '0x14e613AC84a31f709eadbdF89C6CC390fDc9540A';
export const CONVERSION_ADDRESS_LTC_USD = '0x6AF09DF7563C363B5763b9102712EbeD3b9e859B';
