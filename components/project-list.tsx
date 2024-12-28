"use client";

import { useReadContract } from "wagmi";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";

import { CONTRACT_ADDRESS } from "@/contract/config";
import abi from "@/contract/abi";

export const ProjectRow = ({ index }: { index: number }) => {
  // const { data: project, ...args } = useReadContract({
  //   address: CONTRACT_ADDRESS,
  //   abi,
  //   functionName: 'projects',
  //   args: [index],
  // }) as { data: Project };

  // console.log('PROJECT ROW', index);

  const project = {
    active: true,
    name: "Test Project",
    owner: "0x1234567890",
    rewardToken: "0x1234567890",
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
      <TableCell>{project.active ? "Active" : "Inactive"}</TableCell>
    </TableRow>
  );
};

export const ProjectTable = () => {
  const { data: projectCount, ...args } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "projectCount",
  });

  // console.log('PROJECT COUNT', projectCount, args);

  const project = {
    active: true,
    name: "Test Project",
    owner: "0x1234567890",
    rewardToken: "0x1234567890",
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
