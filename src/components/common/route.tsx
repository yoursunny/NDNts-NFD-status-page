import { Component, h } from "preact";

import type { Route } from "../../model/nfd-status/types";
import { If } from "./if";

interface Props {
  route: Route;
  showFlags?: boolean;
}

export class RouteDetail extends Component<Props> {
  public render() {
    const { route, showFlags = true, children } = this.props;
    return (
      <tr>
        {children}
        <td>{route.origin}</td>
        <td>{route.cost}</td>
        <If show={showFlags}>
          <td>
            <If show={route.childInherit}>
              <i title="child-inherit" class="route-flag route-flag-inherit">I</i>
            </If>
            <If show={route.capture}>
              <i title="capture" class="route-flag route-flag-capture">C</i>
            </If>
          </td>
        </If>
      </tr>
    );
  }
}
