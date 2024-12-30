"use client";

import { Button } from "@nextui-org/button";
import {} from "@nextui-org/shared-icons";

import { useAccount, useConnect } from "wagmi";
import { WalletUser } from "./user";

export const ConnectWallet = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, isSuccess } = useConnect();

  if (isConnected && address) {
    return (
      <Button
        className="flex items-center gap-1 h-auto p-3 m-3"
        color="success"
        isDisabled={true}
      >
        <span className="flex items-center">
          Connected as &nbsp;&nbsp;<WalletUser address={address} />
        </span>
      </Button>
    );
  }

  return (
    <Button
      className="flex items-center gap-1"
      color="primary"
      isDisabled={isPending || isSuccess}
      onClick={() => connect({ connector: connectors[0] })}
    >
      <span>Connect Wallet with {connectors[0].name}</span>
    </Button>
  );
};
