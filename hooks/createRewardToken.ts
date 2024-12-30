import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useEffect, useState } from "react";

import { CONTRACT_ADDRESS, MOCK_ERC20_ADDRESS } from "@/contract/config";
import erc from "@/contract/ercabi";

export const useCreateRewardToken = () => {
  const { writeContract, ...args } = useWriteContract();
  const { status } = useWaitForTransactionReceipt({
    hash: args.data,
  });

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
    receiptStatus: status,
  };
};

export const useRewardTokenTransfer = () => {
  const { writeContract, ...args } = useWriteContract();
  const { status } = useWaitForTransactionReceipt({
    hash: args.data,
  });

  return {
    rewardTokenTransfer: (value: bigint) => {
      return writeContract({
        address: MOCK_ERC20_ADDRESS,
        abi: erc,
        args: [CONTRACT_ADDRESS, value],
        functionName: "approve",
      });
    },
    ...args,
    receiptStatus: status,
  };
};

export const useMintAndTransfer = () => {
  const [value, setValue] = useState<bigint>(BigInt(0));
  const { createRewardToken, receiptStatus, error } = useCreateRewardToken();
  const {
    rewardTokenTransfer,
    receiptStatus: tranferReceiptStatus,
    error: tranferError,
  } = useRewardTokenTransfer();

  useEffect(() => {
    if (receiptStatus === "success") {
      rewardTokenTransfer(value);
    }
  }, [receiptStatus]);

  return {
    createRewardToken: (value: bigint) => {
      setValue(value);
      createRewardToken(value);
    },
    rewardTokenTransfer,
    receiptStatus: tranferReceiptStatus,
    error: error || tranferError,
    reset() {
      alert("reset called unexpectedly");
    },
  };
};
