import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
  ssr: true,
  chains: [sepolia, mainnet],
  connectors: [
    metaMask({
      dappMetadata: {
        name: "Doctelligence Contributor",
        url: "https://contributor.doctelligence.com/",
        iconUrl: "https://contributor.doctelligence.com/favicon.svg",
      },
    }),
  ],
  transports: {
    [sepolia.id]: http(),
    // [sepolia.id]: http("http://127.0.0.1:8545/"),
    [mainnet.id]: http(),
  },
  // storage: createStorage({
  //   storage: cookieStorage,
  // }),
});

// {
//   "DINManagerModule#DINManager": "0x6F97A6e9340Ec6D472c4aDfCb3aB85a7F9736a38",
//   "MockERC20Module#MockERC20": "0x6Db84FE80F00D243bF56cEB459A28a46E7210aef"
// }


export const mainnetConfig = createConfig({
  ssr: true,
  chains: [
    mainnet,
    // sepolia
  ],
  connectors: [
    metaMask({
      dappMetadata: {
        name: "Doctelligence Contributor",
        url: "https://contributor.doctelligence.com/",
        iconUrl: "https://contributor.doctelligence.com/favicon.svg",
      },
    }),
  ],
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

// {
//   "DINManagerModule#DINManager": "0x09962c7508fFeE96353C0A6792D92Bb5b305EE9E",
//   "MockERC20Module#MockERC20": "0x007C02F460f40977C5C40efc6d75Ecf2A3AAA3f3"
// }


// export const CONTRACT_ADDRESS = '0xe44706D243C504aF2383B2eF97Fb63e32C6C4679';
export const CONTRACT_ADDRESS = "0x09962c7508fFeE96353C0A6792D92Bb5b305EE9E";
export const MOCK_ERC20_ADDRESS = "0x007C02F460f40977C5C40efc6d75Ecf2A3AAA3f3";
// export const CONTRACT_ADDRESS = "0x83Db5621D40B8F6FC78A328311596F71b82466fc";
// export const MOCK_ERC20_ADDRESS = "0xDfb40BFAa626b3ACD177aCfc3122DD42aD962E9D";
export const CONVERSION_ADDRESS_BTC_USD =
  "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c";
export const CONVERSION_ADDRESS_ETH_USD =
  "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
export const CONVERSION_ADDRESS_LINK_USD =
  "0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c";
export const CONVERSION_ADDRESS_BNB_USD =
  "0x14e613AC84a31f709eadbdF89C6CC390fDc9540A";
export const CONVERSION_ADDRESS_LTC_USD =
  "0x6AF09DF7563C363B5763b9102712EbeD3b9e859B";
