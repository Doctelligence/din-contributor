"use client";

import { Button } from "@nextui-org/button";
import { useCallback, useState } from "react";
import { CONTRACT_ADDRESS } from "@/contract/config";
import abi from "@/contract/abi";
import { useReadContract, useWriteContract } from "wagmi";
import { Code } from "@nextui-org/code";
import { useGetProjectCount } from "@/hooks/getProjectData";

export function WagmiCompoment() {
  const { data: maxScore, error, ...args } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'MAX_SCORE',
  });

  const projectCount = useGetProjectCount();

  if (error) return <code>{error.message}</code>

  return <div>Max Score is <Code><>{maxScore}</></Code> total number of projects <Code><>{projectCount}</></Code></div>
}
