"use client";

import React, { useEffect } from "react";
import { Modal, ModalContent, useDisclosure } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";

import { useCreateRewardToken } from "@/hooks/createRewardToken";

export function CreateTokenModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = React.useState("opaque");
  const { createRewardToken: mint, status, data } = useCreateRewardToken();

  const backdrops = ["blur"];

  const handleOpen = (backdrop: string) => {
    mint(BigInt(0.0001 * 1e18));
  };

  useEffect(() => {
    if (isOpen && status !== "pending") {
      onClose();
      if (status === "success") {
        // console.log({status, data});
      }
    }
    if (!isOpen && status === "pending") {
      setBackdrop(backdrop);
      onOpen();
    }
  }, [isOpen, status]);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {backdrops.map((b) => (
          <Button
            key={b}
            className="capitalize"
            color="warning"
            variant="flat"
            onPress={() => handleOpen(b)}
          >
            {b} ({status})
          </Button>
        ))}
      </div>
      <Modal
        hideCloseButton
        backdrop={"blur"}
        className="bg-opacity-0 border-opacity-0"
        isOpen={isOpen}
      >
        <ModalContent className="bg-opacity-0 border-opacity-0">
          {(onClose) => (
            <>
              {/* <ModalBody> */}
              <Spinner
                className="bg-opacity-0 border-opacity-0"
                color="warning"
                label="Creating Token ..."
              />
              {/* </ModalBody> */}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
