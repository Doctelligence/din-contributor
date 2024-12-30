import { AbiItemArgs, ReadContractReturnType } from "viem";

import abi from "@/contract/abi";
import { MOCK_ERC20_ADDRESS } from "@/contract/config";

type Args = AbiItemArgs<typeof abi, "startProject">;
type ProjectReturnArgs = ReadContractReturnType<typeof abi, "projectInfo">;

export interface StartProjectArgs {
  projectId: Args[0];
  contributorRewardAmount: Args[2];
  validationRewardAmount: Args[3];
  validationCommitmentDeadline: Args[4];
  validationRevealDeadline: Args[5];
}

export function toStartProject(
  args: StartProjectArgs,
): AbiItemArgs<typeof abi, "startProject"> {
  const ret: AbiItemArgs<typeof abi, "startProject"> = [
    args.projectId,
    MOCK_ERC20_ADDRESS,
    args.contributorRewardAmount,
    args.validationRewardAmount,
    args.validationCommitmentDeadline,
    args.validationRevealDeadline,
  ];

  return ret;
}

export interface Project {
  active: boolean;
  name: string;
  owner: string;
  rewardToken: string;
  contributorRewardAmount: number;
  validatorRewardAmount: number;
  validationCommitmentDeadline: number;
  validationRevealDeadline: number;
  numContributors: number;
  numValidators: number;
  totalScore: number;
  totalSuccessfulValidations: number;
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

export function canStartProject(project: {
  active: boolean;
  numValidators: number;
  numContributors: number;
}) {
  return (
    project.active === false &&
    project.numValidators > 0 &&
    project.numContributors > 0
  );
}

interface ProjectInfoReturnType {
  owner: ProjectReturnArgs[0];
  name: ProjectReturnArgs[1];
  active: ProjectReturnArgs[2];
  rewardToken: ProjectReturnArgs[3];
  contributorRewardAmount: ProjectReturnArgs[4];
  validatorRewardAmount: ProjectReturnArgs[5];
  validationCommitmentDeadline: ProjectReturnArgs[6];
  validationRevealDeadline: ProjectReturnArgs[7];
  numContributors: ProjectReturnArgs[8];
  numValidators: ProjectReturnArgs[9];
  totalScore: ProjectReturnArgs[10];
  totalSuccessfulValidations: ProjectReturnArgs[11];
  isValidator?: boolean | undefined;
  isContributor?: boolean | undefined;
}

export function projectInfo(
  rawResult: ProjectReturnArgs, isContributor?: boolean, isValidator?: boolean,
): ProjectInfoReturnType {
  const keys = [
    "owner",
    "name",
    "active",
    "rewardToken",
    "contributorRewardAmount",
    "validatorRewardAmount",
    "validationCommitmentDeadline",
    "validationRevealDeadline",
    "numContributors",
    "numValidators",
    "totalScore",
    "totalSuccessfulValidations",
  ];

  const result: any = {};

  for (let i = 0; i < keys.length; i++) {
    result[keys[i]] = rawResult[i];
  }

  result.isValidator = isValidator;
  result.isContributor = isContributor;

  return result;
}

export function projectInfoToSensibleTypes(
  project: ProjectInfoReturnType,
  projectId: number,
) {
  return {
    ...project,
    active: Boolean(project.active),
    contributorRewardAmount: Number(project.contributorRewardAmount),
    validatorRewardAmount: Number(project.validatorRewardAmount),
    validationCommitmentDeadline: new Date(
      Number(project.validationCommitmentDeadline),
    ),
    validationRevealDeadline: new Date(
      Number(project.validationRevealDeadline),
    ),
    numContributors: Number(project.numContributors),
    numValidators: Number(project.numValidators),
    totalScore: Number(project.totalScore),
    totalSuccessfulValidations: Number(project.totalSuccessfulValidations),
    projectId,
  };
}
