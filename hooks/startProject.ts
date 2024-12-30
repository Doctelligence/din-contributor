import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import { CONTRACT_ADDRESS } from "@/contract/config";
import abi from "@/contract/abi";
import { StartProjectArgs, toStartProject } from "@/utils/project";

export const useStartProject = () => {
  const { writeContract, ...args } = useWriteContract();
  const { status } = useWaitForTransactionReceipt({
    hash: args.data,
  });

  return {
    startProject: (value: StartProjectArgs) => {
      return writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        args: toStartProject(value),
        functionName: "startProject",
      });
    },
    ...args,
    receiptStatus: status,
  };
};
