import { Component, h } from "preact";

interface Props {
  show: boolean;
}

export class If extends Component<Props> {
  public render() {
    const { show, children } = this.props;
    return show ? children : undefined;
  }
}
