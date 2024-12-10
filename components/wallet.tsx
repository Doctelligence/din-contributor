"use client";

import { Button } from "@nextui-org/button";

import {
  HeartFilledIcon
} from "@/components/icons";
import { CONTRACT_ADDRESS } from "@/contract/config";
import abi from "@/contract/abi";
import { useReadContract } from "wagmi";
import { Code } from "@nextui-org/code";

export function WagmiCompoment() {
  const { data: maxScore, error, ...args } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'MAX_SCORE',
  });

  const { data: projectCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'projectCount',
  });

  if (error) return <code>{error.message}</code>

  return <div>Max Score is <Code>{maxScore}</Code> total number of projects <Code>{projectCount}</Code></div>
}
