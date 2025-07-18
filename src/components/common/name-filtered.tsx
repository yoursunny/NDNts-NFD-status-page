import { Component as NameComponent, type Name } from "@ndn/packet";
import jsCookie from "js-cookie";
import { Component, Fragment, h, type JSX } from "preact";

import { nameIncludes } from "../../model/nameutil";

export type NameFilter = (name: Name) => boolean;

interface Props {
  children: (filter: NameFilter) => JSX.Element;
}

interface Toggles {
  hideNlsr: boolean;
  hideKey: boolean;
}

interface State extends Toggles {
  filter?: NameFilter;
}

const NLSR_ROUTER_COMP = NameComponent.from("%C1.Router");
const NLSR_OPERATOR_COMP = NameComponent.from("%C1.Operator");
const KEY_COMP = NameComponent.from("KEY");

export class NameFiltered extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    let toggles: Toggles;
    try {
      const { hideNlsr, hideKey } = JSON.parse(jsCookie.get("NameFiltered")!);
      toggles = { hideNlsr: !!hideNlsr, hideKey: !!hideKey };
    } catch {
      toggles = { hideNlsr: false, hideKey: false };
    }
    this.state = { ...toggles, filter: this.makeFilter(toggles) };
  }

  private makeFilter({ hideNlsr, hideKey }: Readonly<Toggles>): NameFilter {
    jsCookie.set("NameFiltered", JSON.stringify({ hideNlsr, hideKey }), { path: "", sameSite: "Strict" });
    return (name: Name) => {
      switch (true) {
        case hideNlsr && (nameIncludes(name, NLSR_ROUTER_COMP) || nameIncludes(name, NLSR_OPERATOR_COMP)):
        case hideKey && nameIncludes(name, KEY_COMP): {
          return false;
        }
      }
      return true;
    };
  }

  private handleChange = (toggle: keyof Toggles) => () => {
    this.setState((prev) => {
      const toggles = {
        ...prev,
        [toggle]: !prev[toggle],
      };
      return {
        [toggle]: !prev[toggle],
        filter: this.makeFilter(toggles),
      };
    });
  };

  public render() {
    if (!this.state.filter) {
      return undefined;
    }
    return (
      <>
        <form class="pure-form">
          <fieldset>
            <label>
              <input type="checkbox" checked={this.state.hideNlsr} onChange={this.handleChange("hideNlsr")}/>
              {" "}
              hide NLSR names
            </label>
            {" "}
            <label>
              <input type="checkbox" checked={this.state.hideKey} onChange={this.handleChange("hideKey")}/>
              {" "}
              hide KEY names
            </label>
          </fieldset>
        </form>
        {this.props.children(this.state.filter)}
      </>
    );
  }
}
