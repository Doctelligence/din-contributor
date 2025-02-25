import { useEffect, useState } from "react";

import { useStartProject } from "./startProject";
import { useMintAndTransfer } from "./createRewardToken";

import { StartProjectArgs } from "@/utils/project";

export const useStartProjectWithToken = () => {
  const {
    startProject,
    receiptStatus: startProjectStatus,
    reset: resetProject,
    ...startargs
  } = useStartProject();
  const {
    createRewardToken,
    receiptStatus: createRewardTokenStatus,
    // data,
    reset,
    // variables,
    ...args
  } = useMintAndTransfer();
  // TODO: Invoke refresh automatically
  // const projectContext = useContext(Context);
  const [projectArgs, setProjectArgs] =
    useState<Omit<StartProjectArgs, "rewardToken">>();
  const [status, setStatus] = useState<
    "error" | "idle" | "pendingToken" | "pendingProject" | "success"
  >("idle");

  useEffect(() => {
    if (createRewardTokenStatus === "success" && projectArgs) {
      reset();
      startProject(projectArgs);
      setProjectArgs(undefined);
      setStatus("pendingProject");
    } else if (startProjectStatus === "success") {
      resetProject();
      setStatus("success");
    } else if (
      createRewardTokenStatus === "error" ||
      startProjectStatus === "error"
    ) {
      reset();
      resetProject();
      if (createRewardTokenStatus === "error") {
        alert("Failed to create reward token. Error:" + args.error);
      }
      if (startProjectStatus === "error") {
        alert("Failed to start project. Error:" + startargs.error);
      }
      setStatus("error");
    }
  }, [startProjectStatus, createRewardTokenStatus]);

  return {
    startProjectWithToken: (value: Omit<StartProjectArgs, "rewardToken">) => {
      setStatus("pendingToken");
      setProjectArgs(value);
      createRewardToken(
        value.contributorRewardAmount + value.validationRewardAmount,
      );
    },
    status,
  };
};
