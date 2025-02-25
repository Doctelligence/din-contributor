"use client";

import { useMemo } from "react";
import { useReadContract } from "wagmi";

import { CONVERSION_ADDRESS_ETH_USD, mainnetConfig } from "@/contract/config";
import ethabi from "@/contract/ethabi";

let lastUpdate: number | undefined = undefined;
let lastValue = undefined;

export function useGetEthUsdRate() {
  const storage = useMemo(() => {
    // if (lastUpdate && D)
  }, []);

  const { data, ...args } = useReadContract({
    abi: ethabi,
    address: CONVERSION_ADDRESS_ETH_USD,
    config: {
      ...mainnetConfig,
      cacheTime: 300000,
      // storage, // Cache for 5 minutes and use localStorage
    },
    functionName: "latestRoundData",
  });

  // for (let i = 0; i < localStorage.length; i++) {
  //   console.log(`Storage content key [${i}]:`, localStorage.key(i));
  // }

  // Log storage content to check if caching is working
  // console.log('Storage content:', JSON.stringify(localStorage.getItem('wagmi.store'), null, 2));

  return data ? Math.round(Number(data[1]) / 1e6) / 1e2 : undefined;
}
