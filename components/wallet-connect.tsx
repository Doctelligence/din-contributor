'use client';

import { Button } from "@nextui-org/button";
import {  } from "@nextui-org/shared-icons";

import {
  HeartFilledIcon,
  PlugIcon,
} from "@/components/icons";
import { CONTRACT_ADDRESS } from "@/contract/config";
import abi from "@/contract/abi";
import { useAccount, useReadContract, useConnect, useEnsAddress, useEnsName } from "wagmi";
import { Code } from "@nextui-org/code";

export const ConnectWallet = () => {
  const { connect, connectors, ...args } = useConnect();
  const { address, isConnected } = useAccount();

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

  console.log('wallet connectors', args)

  return (
    <Button
      color="primary"
      className="flex items-center gap-1"
      isDisabled={args.isPending || args.isSuccess}
      onClick={() => connect({ connector: connectors[0] })}
    >
      <span>Connect Wallet with {connectors[0].name}</span>
    </Button>
  );
};
