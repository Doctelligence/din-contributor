"use client";

import { useEffect, useState } from "react";
import { Form } from "@nextui-org/form";
import { Input } from "@nextui-org/input";
import { DatePicker } from "@nextui-org/date-picker";
import {
  getLocalTimeZone,
  today,
  now,
  parseZonedDateTime,
} from "@internationalized/date";
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";

import { useStartProjectWithToken } from "@/hooks/startProjectWithToken";
import { useExchange } from "@/app/providers";
import { CONTRIBUTOR_NAME, VALIDATOR_NAME } from "@/config/site";

interface StartProjectForm {
  validationReward: number;
  contributionReward: number;
  contributorDeadline: string;
  validatorDeadline: string;
}

export interface ProjectFormProps {
  projectId: number;
  onClose: () => void;
}

export const StartProjectPage = (props: ProjectFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: StartProjectForm) => {
    setIsSubmitting(true);
    // console.log(data);
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Start a Project</h1>
      <StartProjectForm {...props} />
      {isSubmitting ? <p>Submitting...</p> : null}
    </div>
  );
};

export const StartProjectForm = (props: ProjectFormProps) => {
  const [action, setAction] = useState<string>();
  const [contributorAmount, setContributorAmount] = useState(0.001);
  const [validatorAmount, setValidatorAmount] = useState(0.001);
  const [contributorDeadline, setContributorDeadline] = useState(
    now(getLocalTimeZone()).add({ days: 7 }),
  );
  const rate = useExchange();
  // const rate = useGetEthUsdRate();
  // const rate = undefined;
  // console.log({ rate });

  // const rate = 100;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { startProjectWithToken, status } = useStartProjectWithToken();
  // const { createRewardToken: mint, status: mintStatus, data: mintData } = useCreateRewardToken();
  // const { startProject,  } = useStartProject();

  // const handleOpen = () => {
  //   mint(0.0001)
  // };

  // useEffect(() => {
  //   if (isOpen && mintStatus !== "pending") {
  //     onClose();
  //     if (mintStatus === 'success') {
  //       console.log({status: mintStatus, mintData});
  //     }
  //   }
  //   if (!isOpen && mintStatus === "pending") {
  //     onOpen();
  //   }
  // }, [isOpen, mintStatus]);

  useEffect(() => {
    if (status === "success" || status === "error") {
      props.onClose();
    }
  }, [status]);

  return (
    <div>
      <Form
        className="flex flex-col gap-4 p-4 align-center"
        validationBehavior="aria"
        onReset={() => setAction("reset")}
        onSubmit={(e) => {
          e.preventDefault();

          let data = Object.fromEntries(new FormData(e.currentTarget));

          console.log(data.contributorDeadline, data.validatorDeadline);

          const contributorDeadline = parseZonedDateTime(
            data.contributorDeadline as string,
          );
          const validatorDeadline = parseZonedDateTime(
            data.validatorDeadline as string,
          );

          // console.log(contributorDeadline, validatorDeadline);
          // console.log(contributorDeadline.toDate().valueOf() / 1000, validatorDeadline.offset);

          // return;

          if (validatorDeadline.compare(contributorDeadline)) {
            startProjectWithToken({
              contributorRewardAmount: BigInt(contributorAmount * 1e18),
              validationRewardAmount: BigInt(validatorAmount * 1e18),
              validationCommitmentDeadline: BigInt(
                Math.ceil(contributorDeadline.toDate().valueOf() / 1000),
              ),
              validationRevealDeadline: BigInt(
                Math.ceil(validatorDeadline.toDate().valueOf() / 1000),
              ),
              projectId: BigInt(props.projectId),
            });
            // props.onSubmit(data as unknown as StartProjectForm);
          }
        }}
      >
        <Input
          isRequired
          defaultValue="0.001"
          endContent={
            <span className="text-gray-500">
              {rate
                ? "$" + Math.round(contributorAmount * rate * 100) / 100
                : ""}
            </span>
          }
          label={CONTRIBUTOR_NAME + " Reward (ETH)"}
          labelPlacement="outside"
          min={0.001}
          name="contributionReward"
          placeholder={`Enter total ${CONTRIBUTOR_NAME.toLowerCase()} reward`}
          step={0.001}
          type="number"
          value={`${contributorAmount}`}
          onChange={(e) => setContributorAmount(Number(e.target.value))}
        />

        <Input
          defaultValue='0.001'
          endContent={<span className="text-gray-500">{rate ? '$' + Math.round(validatorAmount * rate * 100) / 100 : ''}</span>}
          labelPlacement="outside"
          min={0.001}
          name="validationReward"
          placeholder={`Enter total ${VALIDATOR_NAME.toLowerCase()} reward`}
          step={0.001}
          type="number"
          value={`${validatorAmount}`}
          onChange={(e) => setValidatorAmount(Number(e.target.value))}
          isRequired
          // errorMessage="Please enter a valid email"
          label={VALIDATOR_NAME + " Reward (ETH)"}
        />
        {/* {rate ? `(conversion rate 1 ETH = $${rate} USD)` : null} */}
        <DatePicker
          showMonthAndYearPickers
          defaultValue={now(getLocalTimeZone()).add({ days: 7 })}
          labelPlacement="outside"
          minValue={today(getLocalTimeZone())}
          name="contributorDeadline"
          onChange={(e) => e && setContributorDeadline(e)}
          isRequired
          // defaultValue={today(getLocalTimeZone()).add({ days: 7 })}
          label={VALIDATOR_NAME + "Score Commitment Deadline"}
        />

        <DatePicker
          showMonthAndYearPickers
          defaultValue={now(getLocalTimeZone()).add({ days: 14 })}
          labelPlacement="outside"
          minValue={contributorDeadline}
          name="validatorDeadline"
          isRequired
          // defaultValue={contributorDeadline.add({ days: 14 })}
          label={VALIDATOR_NAME + " Score Reveal Deadline"}
        />

        <span
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button isDisabled={status !== "idle"} type="reset" variant="flat">
            Reset
          </Button>
          {rate && (
            <Button
              isDisabled
              style={{ float: "right" }}
              type="reset"
              variant="flat"
            >
              {rate
                ? "Cost $" +
                  Math.round(
                    (validatorAmount + contributorAmount) * rate * 100,
                  ) /
                    100
                : ""}
            </Button>
          )}
          <Button color="primary" isDisabled={status !== "idle"} type="submit">
            Submit
          </Button>
        </span>
      </Form>

      <Modal
        hideCloseButton
        backdrop={"blur"}
        className="bg-opacity-0 border-opacity-0"
        isOpen={status === "pendingProject" || status === "pendingToken"}
      >
        <ModalContent className="bg-opacity-0 border-opacity-0">
          <ModalBody>
            <Spinner
              className="bg-opacity-0 border-opacity-0"
              color="warning"
              label={
                status === "pendingProject"
                  ? "Starting Project ..."
                  : "Creating Token ..."
              }
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};
