"use client";

import { CONVERSION_ADDRESS_ETH_USD, mainnetConfig } from "@/contract/config";
import ethabi from "@/contract/ethabi";
import { useReadContract } from 'wagmi';

export function useGetEthUsdRate() {
  const { data } = useReadContract({
    abi: ethabi,
    address: CONVERSION_ADDRESS_ETH_USD,
    config: mainnetConfig,
    functionName: "latestRoundData",
  });

  return data ? (Math.round(Number(data[1]) / 1e6) / 1e2) : undefined;
}
