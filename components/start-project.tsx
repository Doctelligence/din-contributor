"use client";

import { useState } from 'react';
import { Button } from '@nextui-org/button';
import {Form} from '@nextui-org/form';
import { Input } from '@nextui-org/input';
import { DatePicker } from '@nextui-org/date-picker';
import {getLocalTimeZone, parseDate, today} from "@internationalized/date";
import { useReadContract } from 'wagmi';
import ethabi from "@/contract/ethabi";
import { CONVERSION_ADDRESS_ETH_USD, mainnetConfig } from "@/contract/config";

export const StartProjectForm = () => {
  const [action, setAction] = useState<string>();
  const [contributorAmount, setContributorAmount] = useState(0.001);
  const [validatorAmount, setValidatorAmount] = useState(0.001);
  const [contributorDeadline, setContributorDeadline] = useState(today(getLocalTimeZone()).add({days: 7}));
  const { data, ...args } = useReadContract({
    abi: ethabi,
    address: CONVERSION_ADDRESS_ETH_USD,
    config: mainnetConfig,
    functionName: "latestRoundData",
  });

  const rate = data ? (Math.round(Number((data as bigint[])[1]) / 1e6) / 1e2) : undefined;
  // console.log(rate);
  // console.log((data as bigint[]))
  // console.log(mainnetConfig, data && (Number((data as bigint[])[1]) / 1e8), args);

  return (
    <Form
      className="w-full max-w-xs flex flex-col gap-4"
      validationBehavior="aria"
      onReset={() => setAction("reset")}
      onSubmit={(e) => {
        e.preventDefault()

        let data = Object.fromEntries(new FormData(e.currentTarget));

        console.log(e.currentTarget.getAttribute('contributorDeadline'));

        const contributorDeadline = parseDate(data.contributorDeadline as string);
        const validatorDeadline = parseDate(data.validatorDeadline as string);

        if (contributorDeadline <= validatorDeadline) {
          setAction(`submit ${JSON.stringify(data)}`);
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
        // className="max-w-[284px]" 
        label="Contributor Deadline"
        name='contributorDeadline'
        defaultValue={today(getLocalTimeZone()).add({days: 7})}
        minValue={today(getLocalTimeZone())}
        onChange={(e) => e && setContributorDeadline(e)}
      />

      <DatePicker isRequired
        labelPlacement='outside'
        // className="max-w-[284px]"
        label="Validator Deadline"
        name='validatorDeadline'
        defaultValue={contributorDeadline.add({days: 14})}
        minValue={contributorDeadline}
      />
      
      <div className="flex gap-2">
        <Button color="primary" type="submit">
          Submit
        </Button>
        <Button type="reset" variant="flat">
          Reset
        </Button>
      </div>
      {action && (
        <div className="text-small text-default-500">
          Action: <code>{action}</code>
        </div>
      )}
    </Form>
  );
}
