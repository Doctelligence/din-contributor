"use client";

import { createContext, useContext, useMemo } from "react";
import { useReadContract, createStorage } from "wagmi";

import { CONVERSION_ADDRESS_ETH_USD, mainnetConfig } from "@/contract/config";
import ethabi from "@/contract/ethabi";

const EthUsdRateContext = createContext<number | undefined>(undefined);

export function useGetEthUsdRate() {
  const storage = useMemo(() => createStorage({ storage: localStorage }), []);

  const { data } = useReadContract({
    abi: ethabi,
    address: CONVERSION_ADDRESS_ETH_USD,
    config: {
      ...mainnetConfig,
      cacheTime: 300000,
      storage, // Cache for 5 minutes and use localStorage
    },
    functionName: "latestRoundData",
  });

  return data ? Math.round(Number(data[1]) / 1e6) / 1e2 : undefined;
}

// export const EthUsdRateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const rate = useGetEthUsdRate();

//   return (
//     <EthUsdRateContext.Provider value={rate}>
//       {children}
//     </EthUsdRateContext.Provider>
//   );
// };

export const useEthUsdRate = () => {
  return useContext(EthUsdRateContext);
};
