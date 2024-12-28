import { useWriteContract } from "wagmi";

import { CONTRACT_ADDRESS } from "@/contract/config";
import abi from "@/contract/abi";

// export const useAddContributors = () => {
//   const { writeContract, ...args } = useWriteContract();

//   return {
//     addContributors: (args: readonly [bigint, readonly `0x${string}`[]]) => {
//       console.log('addContributors', args);
//       return writeContract({
//         address: CONTRACT_ADDRESS,
//         abi,
//         args,
//         functionName: 'addContributors',
//       })
//     },
//     ...args,
//   };
// };

// export const useAddValidators = () => {
//   const { writeContract, ...args } = useWriteContract();

//   return {
//     startProject: (args: readonly [bigint, readonly `0x${string}`[]]) => {
//       return writeContract({
//         address: CONTRACT_ADDRESS,
//         abi,
//         args,
//         functionName: 'addContributors',
//       });
//     },
//     ...args,
//   };
// };

export const useAddValidatorsOrContributors = () => {
  const { writeContract, ...args } = useWriteContract();

  return {
    add: (
      value: "Contributors" | "Validators",
      args: readonly [bigint, readonly `0x${string}`[]],
    ) => {
      return writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        args,
        functionName:
          value === "Contributors" ? "addContributors" : "addValidators",
      });
    },
    ...args,
  };
};
