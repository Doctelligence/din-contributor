"use client";

import abi from "@/contract/abi";
import { CONTRACT_ADDRESS } from "@/contract/config";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useCallback, useState } from "react";
import { useWriteContract } from "wagmi";

export function CreateContractButton() {
  const { writeContractAsync } = useWriteContract();
  const [isLoading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState('');

  const onClick = useCallback(() => {
    if (isLoading) return;

    setLoading(true);

    writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'createProject',
      args: [projectName],
    })
    .catch(error => {
      console.error(error);
      throw error;
    })
    .finally(() => {
      setProjectName('');
      setLoading(false);
    });

  }, [writeContractAsync]);

  return (
    <>
    <Input
      placeholder="Project Name"
      value={projectName}
      isDisabled={isLoading}
      onChange={e => setProjectName(e.target.value)}
    >
    </Input>
    <Button
      color="primary"
      className="flex items-center gap-1"
      isDisabled={isLoading}
      onClick={onClick}
    >
      <span>Create</span>
    </Button>
    </>
  );
}
