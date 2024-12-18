import { useWriteContract } from 'wagmi';
import { MOCK_ERC20_ADDRESS } from '@/contract/config';
import erc from '@/contract/ercabi';

export const useCreateRewardToken = () => {
  const { writeContractAsync, writeContract, ...args } = useWriteContract();

  return {
    mint: (value: number) => {
      return writeContract({
        address: MOCK_ERC20_ADDRESS,
        abi: erc,
        args: [BigInt(value * 1e18)],
        functionName: 'mint',
      })
    },
    ...args,
  };
};
