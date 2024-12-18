import abi from '@/contract/abi';
import { useWriteContract } from 'wagmi';
import { ContractFunctionArgs, ExtractAbiItem, AbiItemName, AbiItemArgs, Abi } from 'viem';

type Project2 = ContractFunctionArgs<typeof abi, 'nonpayable', 'startProject'>;
type Name = ExtractAbiItem<typeof abi, 'startProject'>['inputs'];
type Name2 = AbiItemName<typeof abi>;
type Args = AbiItemArgs<typeof abi, 'startProject'>;

export interface StartProjectArgs {
  projectId: Args[0],
  rewardToken: Args[1],
  contributorRewardAmount: Args[2],
  validationRewardAmount: Args[3],
  validationCommitmentDeadline: Args[4],
  validationRevealDeadline: Args[5],
}

export function toStartProject(args: StartProjectArgs): AbiItemArgs<typeof abi, 'startProject'> {
  return [
    args.projectId,
    args.rewardToken,
    args.contributorRewardAmount,
    args.validationRewardAmount,
    args.validationCommitmentDeadline,
    args.validationRevealDeadline,
  ];
}

export interface Project {
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

export function toProject(data: any[]): Project {
  return {
    active: data[0],
    name: data[1],
    owner: data[2],
    rewardToken: data[3],
    contributorRewardAmount: data[4],
    validatorRewardAmount: data[5],
    validationCommitmentDeadline: data[6],
    validationRevealDeadline: data[7],
    numContributors: data[8],
    numValidators: data[9],
    totalScore: data[10],
    totalSuccessfulValidations: data[11],
  };
}

export function fromProject(project: Project): any {
  return [
    project.active,
    project.name,
    project.owner,
    project.rewardToken,
    project.contributorRewardAmount,
    project.validatorRewardAmount,
    project.validationCommitmentDeadline,
    project.validationRevealDeadline,
    project.numContributors,
    project.numValidators,
    project.totalScore,
    project.totalSuccessfulValidations,
  ];
}

export function canStartProject(project: Project) {
  return project.active === false
    && project.numValidators > 0
    && project.numContributors > 0;
}


