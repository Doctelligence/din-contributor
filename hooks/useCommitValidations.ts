import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { toHex, keccak256 } from "viem";

import { CONTRACT_ADDRESS } from "@/contract/config";
import abi from "@/contract/abi";
import { ethers } from 'ethers';
import { addValidatorCommitment } from "@/app/postgres";

export const useCommitValidations = () => {
  const account = useAccount();
  const { writeContract, ...args } = useWriteContract();
  const { status } = useWaitForTransactionReceipt({
    hash: args.data,
  });

  return {
    commitValidations: (
      projectId: number,
      scores: Record<`0x${string}`, number>,
    ) => {
      console.log("commitValidations", projectId, scores);
      const contributors = Object.keys(scores) as `0x${string}`[];
      // TODO: Check the encoding here
      console.log("contributors", contributors, );
      const scoreNumbers = contributors.map((address) => {
        return keccak256(ethers.utils.defaultAbiCoder.encode(["bytes32", "uint256"], [address + "000000000000000000000000", scores[address]]) as `0x${string}`);
        // console.log("1", address);

        // console.log(
        //   ethers.utils.defaultAbiCoder.encode(["uint256"], [BigInt(scores[address])])
        // )

        // console.log("2", address);
        // // 0xb17431E497dd0289e076dAF827C036ea90e17cDb
        // // 0x0000000000000000000000000000000000000000000000000000000000000000

        // console.log(
        //   ethers.utils.defaultAbiCoder.encode(["bytes32"], [address + "000000000000000000000000"])
        // )


        // console.log("3", address);




        // const res = ethers.utils.defaultAbiCoder.encode(["bytes32", "uint256"], [address + "000000000000000000000000", scores[address]]);
        
        // console.log("res", res);
        
        // return res;
      }
        // keccak256(
        //   toHex(ethers.utils.defaultAbiCoder.encode(["bytes32", "uint256"], [address, scores[address]]))
        // ),
      );

      console.log("scoreNumbers", scoreNumbers);

      if (!account.address) {
        alert("Please connect your wallet");
        return;
      }

      console.log("addValidatorCommitment", projectId, account.address, scores);

      addValidatorCommitment(projectId, account.address, scores);

      console.log("writeContract", projectId, contributors, scoreNumbers);

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


export const useRevealValidations = () => {
  const { writeContract, ...args } = useWriteContract();
  const { status } = useWaitForTransactionReceipt({
    hash: args.data,
  });

  return {
    revealValidations: (
      projectId: number,
      scores: Record<`0x${string}`, number>,
    ) => {
      const contributors = Object.keys(scores) as `0x${string}`[];
      const args = [BigInt(projectId), contributors, contributors.map(c => c + "000000000000000000000000"),  contributors.map(elem => BigInt(scores[elem]))];

      console.log("revealValidations", args);

      return writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        args: args as any,
        functionName: "revealValidations",
      });
    },
    ...args,
    receiptStatus: status,
  };
};
