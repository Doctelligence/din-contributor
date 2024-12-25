"use client";

import { Link } from "@nextui-org/link";
import { Skeleton } from "@nextui-org/skeleton";
import { Snippet } from "@nextui-org/snippet";
import { User } from "@nextui-org/user";
import { useEnsAvatar, useEnsName } from "wagmi";
import { mainnet } from 'wagmi/chains';
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { createStorage } from 'wagmi';
import { config } from '../contract/config';

type address = `0x${string}`;

const CopyIcon = ({size, height, width, ...props}: { size?: number, height?: number, width?: number }) => {
  return (
    <svg
      fill="none"
      height={size || height || 20}
      shapeRendering="geometricPrecision"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width={size || width || 20}
      {...props}
    >
      <path d="M6 17C4.89543 17 4 16.1046 4 15V5C4 3.89543 4.89543 3 6 3H13C13.7403 3 14.3866 3.4022 14.7324 4M11 21H18C19.1046 21 20 20.1046 20 19V9C20 7.89543 19.1046 7 18 7H11C9.89543 7 9 7.89543 9 9V19C9 20.1046 9.89543 21 11 21Z" />
    </svg>
  );
};

const CheckIcon = ({size, height, width, ...props}: { size?: number, height?: number, width?: number }) => {
  return (
    <svg
      fill="currentColor"
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="m2.394 13.742 4.743 3.62 7.616-8.704-1.506-1.316-6.384 7.296-3.257-2.486zm19.359-5.084-1.506-1.316-6.369 7.279-.753-.602-1.25 1.562 2.247 1.798z" />
    </svg>
  );
};

// const storage = createStorage({ storage: localStorage })
const useEnsNameMocked = (props: { address: address }) => {
  return {
    data: 'test',
    isPending: false,
    isSuccess: true,
  };
}

export function WalletUser(props: { address: address }) {
  const {data: name, isPending: isNamePending, isSuccess: isNameSuccess} = useEnsName({
    address: props.address,
    chainId: mainnet.id,
    config: {
      ...config,
      // storage,
    },
    query: {
      staleTime: Infinity,
      retry: 0,
    },
    scopeKey  : 'wallet-user',
  });
  const {data: avatar, isPending: isAvatarPending} = useEnsAvatar({
    name: typeof name === 'string' ? name : undefined,
    chainId: mainnet.id,
    config: {
      ...config,
      // storage,
    },
    query: {
      staleTime: Infinity,
      retry: 0,
    },
    scopeKey  : 'wallet-user',
  });

  // console.log(name, avatar, isNamePending, isAvatarPending);

  return (
    <User
      avatarProps={{
        radius: "full",
        size: "lg",
        src: typeof avatar === 'string' ? avatar : (
          undefined
          // (isNamePending || (typeof name === 'string' && isAvatarPending)) ? undefined : 'https://avatars.githubusercontent.com/u/63333554?v=4'
        ),
        isBordered: true,
        fallback: (isNamePending || (typeof name === 'string' && isAvatarPending)) ? <Skeleton className="flex rounded-full w-12 h-12" /> : undefined,
      }}
      classNames={{
        description: "text-default-500",
      }}
      description={
        <Snippet
        symbol={false}
          size='sm' checkIcon={<CheckIcon />} copyIcon={<CopyIcon />} variant="bordered">
          {props.address}
        </Snippet>
      }
      name={name ? <Link target="_blank" showAnchorIcon href={`https://app.ens.domains/${name}`}>{name}</Link> : (isNamePending ? <Skeleton className="flex rounded-full w-60 h-3 mb-1" /> : props.address)}
    >
    </User>
  );
}

export function WalletUsersScrollable(props: { addresses: address[] }) {
  return (
    <ScrollShadow hideScrollBar>
      {props.addresses.map(address => (
        <div className="p-1">
          <WalletUser key={address} address={address} />
        </div>
      ))}
    </ScrollShadow>
  );
}
