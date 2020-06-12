import { Component as NameComponent, Name } from "@ndn/packet";
import { get as getCookie, set as setCookie } from "js-cookie";
import { Component, Fragment, h, JSX } from "preact";

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
  public componentDidMount() {
    let toggles: Toggles;
    try {
      const { hideNlsr, hideKey } = JSON.parse(getCookie("NameFiltered")!);
      toggles = { hideNlsr: !!hideNlsr, hideKey: !!hideKey };
    } catch {
      toggles = { hideNlsr: false, hideKey: false };
    }
    this.setState({ ...toggles, filter: this.makeFilter(toggles) });
  }

  private makeFilter({ hideNlsr, hideKey }: Readonly<Toggles>): NameFilter {
    setCookie("NameFiltered", JSON.stringify({ hideNlsr, hideKey }), { path: "", sameSite: "Strict" });
    return (name: Name) => {
      switch (true) {
        case hideNlsr && (nameIncludes(name, NLSR_ROUTER_COMP) || nameIncludes(name, NLSR_OPERATOR_COMP)):
        case hideKey && nameIncludes(name, KEY_COMP):
          return false;
      }
      return true;
    };
  }

  private handleChange = (toggle: keyof Toggles): () => void => {
    return () => {
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
  };

  public render() {
    if (!this.state.filter) {
      return undefined;
    }
    return (
      <Fragment>
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
      </Fragment>
    );
  }
}
