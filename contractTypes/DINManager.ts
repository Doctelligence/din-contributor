/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export interface DINManagerInterface extends utils.Interface {
  functions: {
    "MAX_SCORE()": FunctionFragment;
    "addContributors(uint256,address[])": FunctionFragment;
    "addValidators(uint256,address[])": FunctionFragment;
    "collectContributorReward(uint256)": FunctionFragment;
    "collectValidatorReward(uint256)": FunctionFragment;
    "collectedContributorReward(uint256,address)": FunctionFragment;
    "collectedValidatorReward(uint256,address)": FunctionFragment;
    "commitValidations(uint256,address[],bytes32[])": FunctionFragment;
    "contributorNumScores(uint256,address)": FunctionFragment;
    "contributorTotalScore(uint256,address)": FunctionFragment;
    "createProject(string)": FunctionFragment;
    "getContributor(uint256,uint256)": FunctionFragment;
    "getProjectsByOwner(address)": FunctionFragment;
    "getValidator(uint256,uint256)": FunctionFragment;
    "isContributor(uint256,address)": FunctionFragment;
    "isValidator(uint256,address)": FunctionFragment;
    "numSuccessfulValidations(uint256,address)": FunctionFragment;
    "projectCount()": FunctionFragment;
    "projectInfo(uint256)": FunctionFragment;
    "projects(uint256)": FunctionFragment;
    "revealValidations(uint256,address[],bytes32[],uint256[])": FunctionFragment;
    "score(uint256,address,address)": FunctionFragment;
    "startProject(uint256,address,uint256,uint256,uint256,uint256)": FunctionFragment;
    "validationCommitment(uint256,address,address)": FunctionFragment;
    "validationRevealed(uint256,address,address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "MAX_SCORE"
      | "addContributors"
      | "addValidators"
      | "collectContributorReward"
      | "collectValidatorReward"
      | "collectedContributorReward"
      | "collectedValidatorReward"
      | "commitValidations"
      | "contributorNumScores"
      | "contributorTotalScore"
      | "createProject"
      | "getContributor"
      | "getProjectsByOwner"
      | "getValidator"
      | "isContributor"
      | "isValidator"
      | "numSuccessfulValidations"
      | "projectCount"
      | "projectInfo"
      | "projects"
      | "revealValidations"
      | "score"
      | "startProject"
      | "validationCommitment"
      | "validationRevealed"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "MAX_SCORE", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "addContributors",
    values: [BigNumberish, string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "addValidators",
    values: [BigNumberish, string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "collectContributorReward",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "collectValidatorReward",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "collectedContributorReward",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "collectedValidatorReward",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "commitValidations",
    values: [BigNumberish, string[], BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "contributorNumScores",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "contributorTotalScore",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "createProject",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getContributor",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getProjectsByOwner",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getValidator",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isContributor",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "isValidator",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "numSuccessfulValidations",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "projectCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "projectInfo",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "projects",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "revealValidations",
    values: [BigNumberish, string[], BytesLike[], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "score",
    values: [BigNumberish, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "startProject",
    values: [
      BigNumberish,
      string,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "validationCommitment",
    values: [BigNumberish, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "validationRevealed",
    values: [BigNumberish, string, string]
  ): string;

  decodeFunctionResult(functionFragment: "MAX_SCORE", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "addContributors",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addValidators",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "collectContributorReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "collectValidatorReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "collectedContributorReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "collectedValidatorReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "commitValidations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "contributorNumScores",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "contributorTotalScore",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createProject",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getContributor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getProjectsByOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getValidator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isContributor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isValidator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "numSuccessfulValidations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "projectCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "projectInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "projects", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "revealValidations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "score", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "startProject",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validationCommitment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validationRevealed",
    data: BytesLike
  ): Result;

  events: {};
}

export interface DINManager extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: DINManagerInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    MAX_SCORE(overrides?: CallOverrides): Promise<[BigNumber]>;

    addContributors(
      _projectId: BigNumberish,
      _contributors: string[],
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    addValidators(
      _projectId: BigNumberish,
      _validators: string[],
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    collectContributorReward(
      _projectId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    collectValidatorReward(
      _projectId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    collectedContributorReward(
      _projectId: BigNumberish,
      _contributor: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    collectedValidatorReward(
      _projectId: BigNumberish,
      _validator: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    commitValidations(
      _projectId: BigNumberish,
      _contributors: string[],
      _commitments: BytesLike[],
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    contributorNumScores(
      _projectId: BigNumberish,
      _contributor: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    contributorTotalScore(
      _projectId: BigNumberish,
      _contributor: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    createProject(
      _name: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    getContributor(
      _projectId: BigNumberish,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getProjectsByOwner(
      _owner: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    getValidator(
      _projectId: BigNumberish,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    isContributor(
      _projectId: BigNumberish,
      _address: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isValidator(
      _projectId: BigNumberish,
      _address: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    numSuccessfulValidations(
      _projectId: BigNumberish,
      _validator: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    projectCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    projectInfo(
      _projectId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        string,
        string,
        boolean,
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber
      ] & {
        owner: string;
        name: string;
        active: boolean;
        rewardToken: string;
        contributorRewardAmount: BigNumber;
        validatorRewardAmount: BigNumber;
        validationCommitmentDeadline: BigNumber;
        validationRevealDeadline: BigNumber;
        numContributors: BigNumber;
        numValidators: BigNumber;
        totalScore: BigNumber;
        totalSuccessfulValidations: BigNumber;
      }
    >;

    projects(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        boolean,
        string,
        string,
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber
      ] & {
        active: boolean;
        owner: string;
        name: string;
        rewardToken: string;
        contributorRewardAmount: BigNumber;
        validatorRewardAmount: BigNumber;
        validationCommitmentDeadline: BigNumber;
        validationRevealDeadline: BigNumber;
        totalScore: BigNumber;
        totalSuccessfulValidations: BigNumber;
      }
    >;

    revealValidations(
      _projectId: BigNumberish,
      _contributors: string[],
      _secrets: BytesLike[],
      _scores: BigNumberish[],
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    score(
      _projectId: BigNumberish,
      _validator: string,
      _contributor: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    startProject(
      _projectId: BigNumberish,
      _rewardToken: string,
      _contributorRewardAmount: BigNumberish,
      _validationRewardAmount: BigNumberish,
      _validationCommitmentDeadline: BigNumberish,
      _validationRevealDeadline: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    validationCommitment(
      _projectId: BigNumberish,
      _validator: string,
      _contributor: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    validationRevealed(
      _projectId: BigNumberish,
      _validator: string,
      _contributor: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  MAX_SCORE(overrides?: CallOverrides): Promise<BigNumber>;

  addContributors(
    _projectId: BigNumberish,
    _contributors: string[],
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  addValidators(
    _projectId: BigNumberish,
    _validators: string[],
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  collectContributorReward(
    _projectId: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  collectValidatorReward(
    _projectId: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  collectedContributorReward(
    _projectId: BigNumberish,
    _contributor: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  collectedValidatorReward(
    _projectId: BigNumberish,
    _validator: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  commitValidations(
    _projectId: BigNumberish,
    _contributors: string[],
    _commitments: BytesLike[],
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  contributorNumScores(
    _projectId: BigNumberish,
    _contributor: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  contributorTotalScore(
    _projectId: BigNumberish,
    _contributor: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  createProject(
    _name: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  getContributor(
    _projectId: BigNumberish,
    _index: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  getProjectsByOwner(
    _owner: string,
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  getValidator(
    _projectId: BigNumberish,
    _index: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  isContributor(
    _projectId: BigNumberish,
    _address: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isValidator(
    _projectId: BigNumberish,
    _address: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  numSuccessfulValidations(
    _projectId: BigNumberish,
    _validator: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  projectCount(overrides?: CallOverrides): Promise<BigNumber>;

  projectInfo(
    _projectId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [
      string,
      string,
      boolean,
      string,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber
    ] & {
      owner: string;
      name: string;
      active: boolean;
      rewardToken: string;
      contributorRewardAmount: BigNumber;
      validatorRewardAmount: BigNumber;
      validationCommitmentDeadline: BigNumber;
      validationRevealDeadline: BigNumber;
      numContributors: BigNumber;
      numValidators: BigNumber;
      totalScore: BigNumber;
      totalSuccessfulValidations: BigNumber;
    }
  >;

  projects(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [
      boolean,
      string,
      string,
      string,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber
    ] & {
      active: boolean;
      owner: string;
      name: string;
      rewardToken: string;
      contributorRewardAmount: BigNumber;
      validatorRewardAmount: BigNumber;
      validationCommitmentDeadline: BigNumber;
      validationRevealDeadline: BigNumber;
      totalScore: BigNumber;
      totalSuccessfulValidations: BigNumber;
    }
  >;

  revealValidations(
    _projectId: BigNumberish,
    _contributors: string[],
    _secrets: BytesLike[],
    _scores: BigNumberish[],
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  score(
    _projectId: BigNumberish,
    _validator: string,
    _contributor: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  startProject(
    _projectId: BigNumberish,
    _rewardToken: string,
    _contributorRewardAmount: BigNumberish,
    _validationRewardAmount: BigNumberish,
    _validationCommitmentDeadline: BigNumberish,
    _validationRevealDeadline: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  validationCommitment(
    _projectId: BigNumberish,
    _validator: string,
    _contributor: string,
    overrides?: CallOverrides
  ): Promise<string>;

  validationRevealed(
    _projectId: BigNumberish,
    _validator: string,
    _contributor: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    MAX_SCORE(overrides?: CallOverrides): Promise<BigNumber>;

    addContributors(
      _projectId: BigNumberish,
      _contributors: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    addValidators(
      _projectId: BigNumberish,
      _validators: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    collectContributorReward(
      _projectId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    collectValidatorReward(
      _projectId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    collectedContributorReward(
      _projectId: BigNumberish,
      _contributor: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    collectedValidatorReward(
      _projectId: BigNumberish,
      _validator: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    commitValidations(
      _projectId: BigNumberish,
      _contributors: string[],
      _commitments: BytesLike[],
      overrides?: CallOverrides
    ): Promise<void>;

    contributorNumScores(
      _projectId: BigNumberish,
      _contributor: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    contributorTotalScore(
      _projectId: BigNumberish,
      _contributor: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    createProject(_name: string, overrides?: CallOverrides): Promise<void>;

    getContributor(
      _projectId: BigNumberish,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    getProjectsByOwner(
      _owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    getValidator(
      _projectId: BigNumberish,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    isContributor(
      _projectId: BigNumberish,
      _address: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isValidator(
      _projectId: BigNumberish,
      _address: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    numSuccessfulValidations(
      _projectId: BigNumberish,
      _validator: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    projectCount(overrides?: CallOverrides): Promise<BigNumber>;

    projectInfo(
      _projectId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        string,
        string,
        boolean,
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber
      ] & {
        owner: string;
        name: string;
        active: boolean;
        rewardToken: string;
        contributorRewardAmount: BigNumber;
        validatorRewardAmount: BigNumber;
        validationCommitmentDeadline: BigNumber;
        validationRevealDeadline: BigNumber;
        numContributors: BigNumber;
        numValidators: BigNumber;
        totalScore: BigNumber;
        totalSuccessfulValidations: BigNumber;
      }
    >;

    projects(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        boolean,
        string,
        string,
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber
      ] & {
        active: boolean;
        owner: string;
        name: string;
        rewardToken: string;
        contributorRewardAmount: BigNumber;
        validatorRewardAmount: BigNumber;
        validationCommitmentDeadline: BigNumber;
        validationRevealDeadline: BigNumber;
        totalScore: BigNumber;
        totalSuccessfulValidations: BigNumber;
      }
    >;

    revealValidations(
      _projectId: BigNumberish,
      _contributors: string[],
      _secrets: BytesLike[],
      _scores: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    score(
      _projectId: BigNumberish,
      _validator: string,
      _contributor: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    startProject(
      _projectId: BigNumberish,
      _rewardToken: string,
      _contributorRewardAmount: BigNumberish,
      _validationRewardAmount: BigNumberish,
      _validationCommitmentDeadline: BigNumberish,
      _validationRevealDeadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    validationCommitment(
      _projectId: BigNumberish,
      _validator: string,
      _contributor: string,
      overrides?: CallOverrides
    ): Promise<string>;

    validationRevealed(
      _projectId: BigNumberish,
      _validator: string,
      _contributor: string,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {};

  estimateGas: {
    MAX_SCORE(overrides?: CallOverrides): Promise<BigNumber>;

    addContributors(
      _projectId: BigNumberish,
      _contributors: string[],
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    addValidators(
      _projectId: BigNumberish,
      _validators: string[],
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    collectContributorReward(
      _projectId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    collectValidatorReward(
      _projectId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    collectedContributorReward(
      _projectId: BigNumberish,
      _contributor: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    collectedValidatorReward(
      _projectId: BigNumberish,
      _validator: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    commitValidations(
      _projectId: BigNumberish,
      _contributors: string[],
      _commitments: BytesLike[],
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    contributorNumScores(
      _projectId: BigNumberish,
      _contributor: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    contributorTotalScore(
      _projectId: BigNumberish,
      _contributor: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    createProject(
      _name: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    getContributor(
      _projectId: BigNumberish,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getProjectsByOwner(
      _owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getValidator(
      _projectId: BigNumberish,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isContributor(
      _projectId: BigNumberish,
      _address: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isValidator(
      _projectId: BigNumberish,
      _address: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    numSuccessfulValidations(
      _projectId: BigNumberish,
      _validator: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    projectCount(overrides?: CallOverrides): Promise<BigNumber>;

    projectInfo(
      _projectId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    projects(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    revealValidations(
      _projectId: BigNumberish,
      _contributors: string[],
      _secrets: BytesLike[],
      _scores: BigNumberish[],
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    score(
      _projectId: BigNumberish,
      _validator: string,
      _contributor: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    startProject(
      _projectId: BigNumberish,
      _rewardToken: string,
      _contributorRewardAmount: BigNumberish,
      _validationRewardAmount: BigNumberish,
      _validationCommitmentDeadline: BigNumberish,
      _validationRevealDeadline: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    validationCommitment(
      _projectId: BigNumberish,
      _validator: string,
      _contributor: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    validationRevealed(
      _projectId: BigNumberish,
      _validator: string,
      _contributor: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    MAX_SCORE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    addContributors(
      _projectId: BigNumberish,
      _contributors: string[],
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    addValidators(
      _projectId: BigNumberish,
      _validators: string[],
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    collectContributorReward(
      _projectId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    collectValidatorReward(
      _projectId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    collectedContributorReward(
      _projectId: BigNumberish,
      _contributor: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    collectedValidatorReward(
      _projectId: BigNumberish,
      _validator: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    commitValidations(
      _projectId: BigNumberish,
      _contributors: string[],
      _commitments: BytesLike[],
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    contributorNumScores(
      _projectId: BigNumberish,
      _contributor: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    contributorTotalScore(
      _projectId: BigNumberish,
      _contributor: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    createProject(
      _name: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    getContributor(
      _projectId: BigNumberish,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getProjectsByOwner(
      _owner: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getValidator(
      _projectId: BigNumberish,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isContributor(
      _projectId: BigNumberish,
      _address: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isValidator(
      _projectId: BigNumberish,
      _address: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    numSuccessfulValidations(
      _projectId: BigNumberish,
      _validator: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    projectCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    projectInfo(
      _projectId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    projects(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    revealValidations(
      _projectId: BigNumberish,
      _contributors: string[],
      _secrets: BytesLike[],
      _scores: BigNumberish[],
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    score(
      _projectId: BigNumberish,
      _validator: string,
      _contributor: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    startProject(
      _projectId: BigNumberish,
      _rewardToken: string,
      _contributorRewardAmount: BigNumberish,
      _validationRewardAmount: BigNumberish,
      _validationCommitmentDeadline: BigNumberish,
      _validationRevealDeadline: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    validationCommitment(
      _projectId: BigNumberish,
      _validator: string,
      _contributor: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    validationRevealed(
      _projectId: BigNumberish,
      _validator: string,
      _contributor: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
