import { useEffect, useMemo } from "react";
import { useAccount, useReadContract, useReadContracts } from "wagmi";

import abi from "@/contract/abi";
import { CONTRACT_ADDRESS } from "@/contract/config";
import { projectInfo, projectInfoToSensibleTypes } from "@/utils/project";
import { LIVE_UPDATE } from "@/config/site";

// TODO: Add events to the chain to make it easier
// to live update this
export function useGetProjectCount() {
  const { data: projectCount, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "projectCount",
  });

  // TODO: Use events rather than polling
  if (LIVE_UPDATE) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      setInterval(() => {
        // console.log('refetching project count');
        refetch();
      }, 2_500);
    }, []);
  }

  // useWatchContractEvent({
  //   address: CONTRACT_ADDRESS,
  //   abi,
  //   eventName: 'projectCount',
  //   onLogs: (logs) => {
  //     console.log('projectCount logs', logs);
  //     refetch();
  //   },
  // });

  return Number(projectCount);
}

export function useGetProjectData() {
  const account = useAccount();
  const projectCount = useGetProjectCount();
  const contracts = useMemo(
    () =>
      new Array(projectCount || 0).fill(undefined).map((_, i) => ({
        abi,
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "projectInfo" as const,
        args: [i],
      })),
    [projectCount],
  );
  const isContributor = useMemo(
    () =>
      new Array(projectCount || 0).fill(undefined).map((_, i) => ({
        abi,
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "isContributor" as const,
        args: [i, account.address],
      })),
    [projectCount, account.address],
  );
  const isValidator = useMemo(
    () =>
      new Array(projectCount || 0).fill(undefined).map((_, i) => ({
        abi,
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "isValidator" as const,
        args: [i, account.address],
      })),
    [projectCount, account.address],
  );
  const { data: projects, refetch } = useReadContracts({ contracts });
  const { data: isContributorData, refetch: contribRefetch } = useReadContracts({ contracts: isContributor });
  const { data: isValidatorData, refetch: validatorRefetch } = useReadContracts({ contracts: isValidator });



  // TODO: Use events rather than polling
  if (LIVE_UPDATE) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      setInterval(() => {
        refetch();
        contribRefetch();
        validatorRefetch();
      }, 20_000);
    }, []);
  }

  // FUTURE: Improve error handling behavior
  const allProjects = useMemo(
    () =>
      projects && projects.every((p) => p.status === "success")
        ? projects.map((p, i) =>
            projectInfoToSensibleTypes(projectInfo(p.result, (isContributorData && isContributorData[i]?.status === 'success') ? isContributorData[i].result : undefined, (isValidatorData && isValidatorData[i]?.status === 'success') ? isValidatorData[i].result : undefined), i),
          )
        : undefined,
    [projects, isContributorData, isValidatorData],
  );

  return allProjects;
}

// FUTURE: Query this in a more optimized way the the events
// API
export function useGetProjectDataByOwner(owner: `0x${string}`) {
  const projects = useGetProjectData();

  // FUTURE: Improve error handling behavior
  return useMemo(
    () => (projects ? projects.filter((p) => p.owner === owner) : undefined),
    [projects],
  );
}
