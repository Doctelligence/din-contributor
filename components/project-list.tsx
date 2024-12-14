'use client';

import { Button } from "@nextui-org/button";
import { useMemo } from "react";
import {
  HeartFilledIcon
} from "@/components/icons";
import { CONTRACT_ADDRESS } from "@/contract/config";
import abi from "@/contract/abi";
import { useAccount, useReadContract, useWriteContract,  } from "wagmi";
import { Code } from "@nextui-org/code";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@nextui-org/table";

interface Project {
  active: boolean,
  name: string,
  owner: string,
  rewardToken: string,
  contributorRewardAmount: number,
  validatorRewardAmount: number,
  validationCommitmentDeadline: number,
  validationRevealDeadline: number,
  numContributors: number,
  numValidators: number,
  totalScore: number,
  totalSuccessfulValidations: number,
}

export const ProjectRow = ({ index }: { index: number }) => {
  // const { data: project, ...args } = useReadContract({
  //   address: CONTRACT_ADDRESS,
  //   abi,
  //   functionName: 'projects',
  //   args: [index],
  // }) as { data: Project };

  console.log('PROJECT ROW', index);

  const project = {
    active: true,
    name: 'Test Project',
    owner: '0x1234567890',
    rewardToken: '0x1234567890',
    contributorRewardAmount: 100,
    validatorRewardAmount: 100,
    validationCommitmentDeadline: 100,
    validationRevealDeadline: 100,
    numContributors: 100,
    numValidators: 100,
    totalScore: 100,
    totalSuccessfulValidations: 100,
  };

  return (
    <TableRow key={index} tabIndex={index}>
      <TableCell>{project.name}</TableCell>
      <TableCell>{project.owner}</TableCell>
      <TableCell>{project.active ? 'Active' : 'Inactive'}</TableCell>
    </TableRow>
  );
};

export const ProjectTable = () => {

  const { data: projectCount, ...args } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'projectCount',
  });

  console.log('PROJECT COUNT', projectCount, args);

  const project = {
    active: true,
    name: 'Test Project',
    owner: '0x1234567890',
    rewardToken: '0x1234567890',
    contributorRewardAmount: 100,
    validatorRewardAmount: 100,
    validationCommitmentDeadline: 100,
    validationRevealDeadline: 100,
    numContributors: 100,
    numValidators: 100,
    totalScore: 100,
    totalSuccessfulValidations: 100,
  };


  return (
    <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>OWNER</TableColumn>
        <TableColumn>STATUS</TableColumn>
      </TableHeader>
      <TableBody>
        <ProjectRow index={0} />
      </TableBody>
    </Table>
  );
};
