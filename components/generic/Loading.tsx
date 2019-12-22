import React, { Component } from 'react';
import { NonIdealState, Spinner } from '@blueprintjs/core';

interface Props {
  title: string;
  description?: string;
}

interface Defaults {
  title: string;
}

export default class Loading extends Component<Props, {}, Defaults> {
  static defaultProps: Defaults = {
    title: 'Loading',
  };

  render(): JSX.Element {
    const { title, description } = this.props;
    return (
      <div>
        <NonIdealState icon={<Spinner />} title={title} description={description} />
      </div>
    );
  }
}
