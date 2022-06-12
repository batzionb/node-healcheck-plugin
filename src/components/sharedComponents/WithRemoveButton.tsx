import { Button, Flex, FlexItem } from "@patternfly/react-core";
import { MinusCircleIcon } from "@patternfly/react-icons";
import * as React from "react";
import "./WithRemoveButton.css";

export const WithRemoveButton = ({
  children,
  isDisabled,
  onClick,
}: {
  children: React.ReactNode;
  isDisabled: boolean;
  onClick;
}) => {
  return (
    <Flex>
      <FlexItem grow={{ default: "grow" }} spacer={{ default: "spacerSm" }}>
        {children}
      </FlexItem>
      <FlexItem id="remove-button">
        <Button
          type="button"
          variant="plain"
          onClick={onClick}
          isDisabled={isDisabled}
        >
          <MinusCircleIcon />
        </Button>
      </FlexItem>
    </Flex>
  );
};
