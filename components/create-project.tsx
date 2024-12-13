"use client";

import abi from "@/contract/abi";
import { CONTRACT_ADDRESS } from "@/contract/config";
import { Button } from "@nextui-org/button";
import { useCallback, useState } from "react";
import { useWriteContract } from "wagmi";

export function CreateContractButton() {
  const { writeContractAsync } = useWriteContract();
  const [isLoading, setLoading] = useState(false);

  const onClick = useCallback(() => {
    if (isLoading) return;

    setLoading(true);

    writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'createProject',
    })
    .catch(error => {
      console.error(error);
      throw error;
    })
    .finally(() => setLoading(false));

  }, [writeContractAsync]);

  return (
    <Button
      color="primary"
      className="flex items-center gap-1"
      disabled={isLoading}
      onClick={onClick}
    >
      <span>Create Project</span>
    </Button>
  );
}
