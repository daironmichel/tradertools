import React from "react";
import { NonIdealState } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { Flex } from "rebass";

interface Props {
  title?: React.ReactNode;
  statusCode?: string | number | null;
  description?: React.ReactChild;
  action?: JSX.Element;
}

export default function ErrorState(props: Props) {
  const { title, statusCode, description, action } = props;
  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center" flex="1" p={3}>
      <NonIdealState
        icon={IconNames.ERROR}
        title={title || `Unhandled Error ${statusCode || 404}`}
        description={description}
        action={action}
      />
    </Flex>
  );
}
