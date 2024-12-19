import { useEffect, useState, useMemo } from 'react';
import { useStartProject } from './startProject';
import { useCreateRewardToken } from './createRewardToken';
import { StartProjectArgs } from '@/components/project';

// BigInt(value * 1e18)

interface StartProjectForm {
  validationReward: number,
  contributionReward: number,
  contributorDeadline: string,
  validatorDeadline: string,
}

export const useStartProjectWithToken = () => {
  const { startProject, status: startProjectStatus, reset: resetProject } = useStartProject();
  const { createRewardToken, status: createRewardTokenStatus, data, reset } = useCreateRewardToken();
  const [ projectArgs, setProjectArgs ] = useState<Omit<StartProjectArgs, 'rewardToken'>>();
  const [ status, setStatus ] = useState<"error" | "idle" | "pendingToken" | "pendingProject" | "success">("idle");

  useEffect(() => {
    if (createRewardTokenStatus === 'success' && projectArgs) {
      reset();
      startProject({
        ...projectArgs,
        rewardToken: data,
      });
      setProjectArgs(undefined);
      setStatus("pendingProject");
    } else if (startProjectStatus === 'success') {
      resetProject();
      setStatus("success");
    } else if (createRewardTokenStatus === 'error' || startProjectStatus === 'error') {
      reset();
      resetProject();
      setStatus("error");
    }
  }, [startProjectStatus, createRewardTokenStatus]);

  return {
    startProjectWithToken: (value: Omit<StartProjectArgs, 'rewardToken'>) => {
      setStatus("pendingToken");
      setProjectArgs(value);
      createRewardToken(value.contributorRewardAmount + value.validationRewardAmount);
    },
    status,
  }
};
