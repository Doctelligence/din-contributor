"use client";

import { getDownloadUrl } from "@vercel/blob";
import { useEffect, useState } from "react";

import { CONTRACT_ADDRESS } from "@/contract/config";

interface PendingRequestsSuccess {
  projectId: number;
  pendingContributors: `0x${string}`[];
  pendingValidators: `0x${string}`[];
  status: "success";
}

interface PendingRequests {
  projectId: undefined;
  pendingContributors: undefined;
  pendingValidators: undefined;
  status: "loading" | "error";
}

function toUrl(projectId: number) {
  return `${CONTRACT_ADDRESS}/${projectId}`;
}

export function usePendingRequests(props: { projectId: number }) {
  const [pendingRequests, setPendingRequests] = useState<
    PendingRequests | PendingRequestsSuccess
  >({
    projectId: undefined,
    pendingContributors: undefined,
    pendingValidators: undefined,
    status: "loading",
  });

  useEffect(() => {
    fetch(getDownloadUrl(toUrl(props.projectId)))
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();

          setPendingRequests({
            projectId: props.projectId,
            pendingContributors: data.pendingContributors,
            pendingValidators: data.pendingValidators,
            status: "success",
          });
        } else {
          setPendingRequests({
            projectId: undefined,
            pendingContributors: undefined,
            pendingValidators: undefined,
            status: "error",
          });
        }
      })
      .catch(() => {
        setPendingRequests({
          projectId: undefined,
          pendingContributors: undefined,
          pendingValidators: undefined,
          status: "error",
        });
      });
  }, [props.projectId]);

  return pendingRequests;
}

// const { url } = await put('articles/blob.txt', 'Hello World!', { access: 'public' });
