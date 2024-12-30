"use client";
import { useReadContracts } from "wagmi";

import abi from "@/contract/abi";
import { CONTRACT_ADDRESS } from "@/contract/config";

export function useGetContributorsOrValidators(props: {
  projectId: number;
  num: number;
  fn: "getContributor" | "getValidator";
}) {
  return useReadContracts({
    contracts: new Array(props.num).fill(undefined).map((_, i) => ({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: props.fn as "getContributor" | "getValidator",
      args: [BigInt(props.projectId), BigInt(i)],
    })),
  });
}
