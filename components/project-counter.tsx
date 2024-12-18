'use client';

import { Button } from "@nextui-org/button";

import {
  HeartFilledIcon
} from "@/components/icons";
import { CONTRACT_ADDRESS } from "@/contract/config";
import abi from "@/contract/abi";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { Code } from "@nextui-org/code";

export const ProjectCount = () => {
  console.log('PROJECT CALLED CALLED')

   const account = useAccount();

  const { data: projectCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'projectCount',
  });

  const createProject = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'projects',
  });

  // const createdProject = useReadContract({
  //   address: CONTRACT_ADDRESS,
  //   abi,
  //   functionName: 'createProject',
  // });

  // console.log('CALLING ADDRESSES', account.address, createProject.data, createdProject);

  // const { data } = useWriteContract({
  //   config: {
  //   // address: CONTRACT_ADDRESS,
  //   // abi,
  //   // functionName: 'projectCount',
  // });

  return (
    <Button
      color="primary"
      className="flex items-center gap-1"
    >
      <span>{account.address} DIN Project Count <Code><>{projectCount ?? '?'}</></Code></span>
    </Button>
  );
};
