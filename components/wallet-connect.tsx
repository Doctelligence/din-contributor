"use client";

import { Button } from "@nextui-org/button";
import {  } from "@nextui-org/shared-icons";

import {
  HeartFilledIcon,
  PlugIcon,
} from "@/components/icons";
import { CONTRACT_ADDRESS } from "@/contract/config";
import abi from "@/contract/abi";
import { useAccount, useReadContract, useConnect } from "wagmi";
import { Code } from "@nextui-org/code";

export const ConnectWallet = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, isSuccess } = useConnect();

  if (isConnected) {
    return (
      <Button
        color="success"
        className="flex items-center gap-1"
        isDisabled={true}
      >
        <span>Connected to {address}</span>
      </Button>
    );
  }

  return (
    <Button
      color="primary"
      className="flex items-center gap-1"
      isDisabled={isPending || isSuccess}
      onClick={() => connect({ connector: connectors[0] })}
    >
      <span>Connect Wallet with {connectors[0].name}</span>
    </Button>
  );
};
