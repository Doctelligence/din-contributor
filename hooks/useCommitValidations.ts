import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { toHex, keccak256 } from "viem";

import { CONTRACT_ADDRESS } from "@/contract/config";
import abi from "@/contract/abi";

export const useCommitValidations = () => {
  const { writeContract, ...args } = useWriteContract();
  const { status } = useWaitForTransactionReceipt({
    hash: args.data,
  });

  return {
    commitValidations: (
      projectId: number,
      scores: Record<`0x${string}`, number>,
    ) => {
      const contributors = Object.keys(scores) as `0x${string}`[];
      // TODO: Check the encoding here
      const scoreNumbers = contributors.map((address) =>
        keccak256(toHex(scores[address])),
      );

      return writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        args: [BigInt(projectId), contributors, scoreNumbers],
        functionName: "commitValidations",
      });
    },
    ...args,
    receiptStatus: status,
  };
};
