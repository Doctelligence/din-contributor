'use client';

import { Button } from "@nextui-org/button";

import {
  HeartFilledIcon
} from "@/components/icons";
import { CONTRACT_ADDRESS } from "@/contract/config";
import abi from "@/contract/abi";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { Code } from "@nextui-org/code";
import { useGetProjectCount } from '@/hooks/getProjectData';

export const ProjectCount = () => {
   const account = useAccount();
   const projectCount = useGetProjectCount();

  return (
    <Button
      color="primary"
      className="flex items-center gap-1"
    >
      <span>{account.address} DIN Project Count <Code><>{projectCount ?? '?'}</></Code></span>
    </Button>
  );
};
