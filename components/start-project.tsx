"use client";

import { useEffect, useState } from 'react';
import { Form } from '@nextui-org/form';
import { Input } from '@nextui-org/input';
import { DatePicker } from '@nextui-org/date-picker';
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { useReadContract } from 'wagmi';
import ethabi from "@/contract/ethabi";
import { CONVERSION_ADDRESS_ETH_USD, mainnetConfig } from "@/contract/config";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { useCreateRewardToken } from "@/hooks/createRewardToken";
import { useStartProject } from '@/hooks/startProject';
import { useStartProjectWithToken } from '@/hooks/startProjectWithToken';
import { useGetEthUsdRate } from '@/hooks/getEthUsdRate';

interface StartProjectForm {
  validationReward: number,
  contributionReward: number,
  contributorDeadline: string,
  validatorDeadline: string,
}

export interface ProjectFormProps {
  projectId: number;
  onClose: () => void;
}

export const StartProjectPage = (props: ProjectFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: StartProjectForm) => {
    setIsSubmitting(true);
    console.log(data);
    setIsSubmitting(false);
  }

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
  const [contributorDeadline, setContributorDeadline] = useState(today(getLocalTimeZone()).add({ days: 7 }));
  const rate = useGetEthUsdRate();


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

  return (
    <div>
      <Form
        className="w-full max-w-xs flex flex-col gap-4 p-4 align-center"
        validationBehavior="aria"
        onReset={() => setAction("reset")}
        onSubmit={(e) => {
          e.preventDefault()

          let data = Object.fromEntries(new FormData(e.currentTarget));

          console.log(e.currentTarget.getAttribute('contributorDeadline'));

          const contributorDeadline = parseDate(data.contributorDeadline as string);
          const validatorDeadline = parseDate(data.validatorDeadline as string);

          if (validatorDeadline.compare(contributorDeadline)) {
            startProjectWithToken({
              contributorRewardAmount: BigInt(contributorAmount * 1e18),
              validationRewardAmount: BigInt(validatorAmount * 1e18),
              validationCommitmentDeadline: BigInt(validatorDeadline.toDate('utc').valueOf()),
              validationRevealDeadline: BigInt(validatorDeadline.toDate('utc').valueOf()),
              projectId: BigInt(props.projectId),
            });
            props.onClose();
            // props.onSubmit(data as unknown as StartProjectForm);
          }
        }}
      >
        <Input
          isRequired
          label="Contribution Reward (ETH)"
          labelPlacement="outside"
          name="contributionReward"
          placeholder="Enter total validation reward"
          type="number"
          min={0.001}
          step={0.001}
          defaultValue='0.001'
          value={`${contributorAmount}`}
          onChange={(e) => setContributorAmount(Number(e.target.value))}
          endContent={<span className="text-gray-500">{rate ? '$' + Math.round(contributorAmount * rate * 100) / 100 : ''}</span>}
        />

        <Input
          isRequired
          // errorMessage="Please enter a valid email"
          label="Validation Reward (ETH)"
          labelPlacement="outside"
          name="validationReward"
          placeholder="Enter total contribution reward"
          type="number"
          min={0.001}
          step={0.001}
          defaultValue='0.001'
          value={`${validatorAmount}`}
          onChange={(e) => setValidatorAmount(Number(e.target.value))}
          endContent={<span className="text-gray-500">{rate ? '$' + Math.round(validatorAmount * rate * 100) / 100 : ''}</span>}
        />
        {/* {rate ? `(conversion rate 1 ETH = $${rate} USD)` : null} */}
        <DatePicker isRequired
          labelPlacement='outside'
          label="Contributor Deadline"
          name='contributorDeadline'
          defaultValue={today(getLocalTimeZone()).add({ days: 7 })}
          minValue={today(getLocalTimeZone())}
          onChange={(e) => e && setContributorDeadline(e)}
        />

        <DatePicker isRequired
          labelPlacement='outside'
          label="Validator Deadline"
          name='validatorDeadline'
          defaultValue={contributorDeadline.add({ days: 14 })}
          minValue={contributorDeadline}
        />

        <div className="flex gap-2">
          <Button color="primary" type="submit">
            Submit
          </Button>
          <Button type="reset" variant="flat">
            Reset
          </Button>
          <Button type="reset" variant="flat" isDisabled className='align-right'>
            {rate ? 'Cost $' + Math.round((validatorAmount + contributorAmount) * rate * 100) / 100 : ''}
          </Button>
        </div>
      </Form>

      <Modal backdrop={"blur"} isOpen={status === 'pendingProject' || status === 'pendingToken'} hideCloseButton className="bg-opacity-0 border-opacity-0">
        <ModalContent className="bg-opacity-0 border-opacity-0">
          <ModalBody>
            <Spinner
              color="warning"
              label={status === 'pendingProject' ? "Starting Project ..." : "Creating Token ..."}
              className="bg-opacity-0 border-opacity-0"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
