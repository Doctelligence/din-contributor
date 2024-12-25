"use client";

import abi from "@/contract/abi";
import { CONTRACT_ADDRESS } from "@/contract/config";
import { useCreateRewardToken } from "@/hooks/createRewardToken";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Modal, ModalContent, useDisclosure } from "@nextui-org/modal";
import { Spinner } from "@nextui-org/spinner";
import React from "react";
import { useCallback, useState } from "react";
import { useWriteContract } from "wagmi";
import { ArrowIcon, SearchIcon } from "./icons";

export function CreateContractButton(props: { onStart: () => void }) {
  const { writeContractAsync } = useWriteContract();
  const [isLoading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState('');

  const onClick = useCallback(() => {
    if (projectName.length < 5) return;
    if (isLoading) return;

    setLoading(true);

    writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'createProject',
      args: [projectName],
    })
    .catch(error => {
      console.error(error);
      throw error;
    })
    .finally(() => {
      setProjectName('');
      setLoading(false);
      props.onStart();
    });
  }, [writeContractAsync, projectName]);

  return (
    <>
    {/* <Input
                isClearable
                classNames={{
                  base: "w-full sm:max-w-[44%]",
                  inputWrapper: "border-1",
                }}
                placeholder="Search by name..."
                size="sm"
                startContent={<SearchIcon className="text-default-300" />}
                // value={filterValue}
                variant="bordered"
                // onClear={() => setFilterValue("")}
                // onValueChange={onSearchChange}
              /> */}
    <Input
      placeholder="New Project Name"
      value={projectName}
      isDisabled={isLoading}
      onChange={e => {
        // console.log('Setting project name:', e.target.value);
        setProjectName(e.target.value)
      }}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          onClick();
        }
      }}
      className="pr-0 mr-0"
      endContent={
        <Button
          className="bg-opacity-0	mr-0 p-0 flex-none w-10"
          isDisabled={isLoading}
          onPress={onClick}
        >
          <ArrowIcon />
        </Button>
      }
      minLength={5}
    >
    </Input>
    {/* <Button
      color="primary"
      className="flex items-center gap-1"
      isDisabled={isLoading}
      onClick={onClick}
    >
      <span>Create</span>
    </Button> */}
    </>
  );
}

export function CreateContractModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  // const [backdrop, setBackdrop] = React.useState("opaque");
  // const { createRewardToken: mint, status, data } = useCreateRewardToken();

  return (
    <Modal hideCloseButton backdrop={"blur"} isOpen={isOpen} className="bg-opacity-0 border-opacity-0" onClose={onClose}>
      <ModalContent className="bg-opacity-0 border-opacity-0">
        <CreateContractButton onStart={onClose} />
      </ModalContent>
    </Modal>
  );
}
