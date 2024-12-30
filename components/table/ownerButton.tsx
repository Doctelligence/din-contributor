import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";

import { OWNER_NAME } from "@/config/site";

export function OwnerButton({
  isChecked,
  onChange,
}: {
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
}) {
  return (
    <Button
      className="mr-0 pr-0"
      endContent={
        <Checkbox
          className="m-0 p-0"
          isSelected={isChecked}
          title="Owned"
          onChange={(content) => onChange(content.target.checked)}
        />
      }
      size="sm"
      variant="flat"
      onPress={() => onChange(!isChecked)}
    >
      {OWNER_NAME}
    </Button>
  );
}
