import { useWriteContract } from 'wagmi';
import { MOCK_ERC20_ADDRESS } from '@/contract/config';
import abi from '@/contract/abi';
import { StartProjectArgs, toStartProject } from '@/components/project'

export const useStartProject = () => {
  const { writeContractAsync, writeContract, ...args } = useWriteContract();

  return {
    startProject: (value: StartProjectArgs) => {
      return writeContractAsync({
        address: MOCK_ERC20_ADDRESS,
        abi,
        args: toStartProject(value),
        functionName: 'startProject',
      })
    },
    ...args,
  };
};
