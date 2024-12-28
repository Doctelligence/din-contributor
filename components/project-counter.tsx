"use client";

import { Button } from "@nextui-org/button";
import { useAccount } from "wagmi";
import { Code } from "@nextui-org/code";

import { useGetProjectCount } from "@/hooks/getProjectData";

export const ProjectCount = () => {
  const account = useAccount();
  const projectCount = useGetProjectCount();

  return (
    <Button className="flex items-center gap-1" color="primary">
      <span>
        {account.address} DIN Project Count{" "}
        <Code>
          <>{projectCount ?? "?"}</>
        </Code>
      </span>
    </Button>
  );
};
