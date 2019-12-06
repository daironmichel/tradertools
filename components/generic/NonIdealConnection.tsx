import React, { Component } from "react";
import { IconName, NonIdealState } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

type ConnectionType = {
  readonly edges?: ReadonlyArray<any>;
};

interface Props {
  connection: ConnectionType | null | undefined;
  icon: IconName;
  title: string;
  description: string;
}

interface Defaults {
  icon: IconName;
  title: string;
  description: string;
}

export default class NonIdealConnection extends Component<Props, {}, Defaults> {
  static defaultProps: Defaults = {
    icon: IconNames.INBOX,
    title: "Nothing Here",
    description: "This list is empty."
  };

  render() {
    const { connection, icon, title, description, children } = this.props;
    return (
      <>
        {connection && connection.edges && connection.edges.length > 0 ? (
          children
        ) : (
          <NonIdealState icon={icon} title={title} description={description} />
        )}
      </>
    );
  }
}
