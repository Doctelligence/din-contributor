"use client";
import { useReadContracts, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import abi from "@/contract/abi";
import { CONTRACT_ADDRESS } from "@/contract/config";

export function useCollectValidationReward() {
  const { writeContract, ...args } = useWriteContract();
    const { status } = useWaitForTransactionReceipt({
      hash: args.data,
    });
  
    return {
      collectValidationReward: (
        projectId: number,
      ) => {
        return writeContract({
          address: CONTRACT_ADDRESS,
          abi,
          args: [BigInt(projectId)],
          functionName: "collectValidatorReward",
        });
      },
      ...args,
      receiptStatus: status,
    };
}
