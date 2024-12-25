import { useEffect, useMemo } from 'react';
import { useReadContract, useReadContracts } from 'wagmi';
import abi from "@/contract/abi";
import { CONTRACT_ADDRESS } from "@/contract/config";
import { toProject, projectInfo, projectInfoToSensibleTypes } from '@/utils/project';
import { useWatchContractEvent } from 'wagmi';
import { LIVE_UPDATE } from '@/config/site';

// TODO: Add events to the chain to make it easier
// to live update this
export function useGetProjectCount() {
  const { data: projectCount, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'projectCount',
  });

  // TODO: Use events rather than polling
  if (LIVE_UPDATE) {
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
  const projectCount = useGetProjectCount();
  const contracts = useMemo(
    () => new Array(projectCount || 0)
      .fill(undefined)
      .map((_, i) => ({
        abi,
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: 'projectInfo' as const,
        args: [i],
      })), [projectCount]);
  const { data: projects, refetch } = useReadContracts({ contracts });

  // TODO: Use events rather than polling
  if (LIVE_UPDATE) {
    useEffect(() => {
      setInterval(() => {
        // console.log('refetching project count');
        refetch();
      }, 2_500);
    }, []);
  }

  // FUTURE: Improve error handling behavior
  return useMemo(
    () => projects && projects.every((p) => p.status === 'success')
      ? projects.map((p, i) => projectInfoToSensibleTypes(projectInfo(p.result), i))
      : undefined
    , [projects?.length]);
}

// FUTURE: Query this in a more optimized way the the events
// API
export function useGetProjectDataByOwner(owner: `0x${string}`) {
  const projects = useGetProjectData();

  // FUTURE: Improve error handling behavior
  return useMemo(
    () => projects
      ? projects.filter((p) => p.owner === owner)
      : undefined
    , [projects]);
}
