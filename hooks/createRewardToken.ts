import { useWriteContract } from "wagmi";

import { MOCK_ERC20_ADDRESS } from "@/contract/config";
import erc from "@/contract/ercabi";

export const useCreateRewardToken = () => {
  const { writeContract, ...args } = useWriteContract();

  return {
    createRewardToken: (value: bigint) => {
      return writeContract({
        address: MOCK_ERC20_ADDRESS,
        abi: erc,
        args: [value],
        functionName: "mint",
      });
    },
    ...args,
  };
};
