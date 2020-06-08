import { Component as NameComponent, Name } from "@ndn/packet";
import { get as getCookie, set as setCookie } from "js-cookie";
import { Component, Fragment, h, JSX } from "preact";

export type NameFilter = (name: Name) => boolean;

interface Props {
  children: (filter: NameFilter) => JSX.Element;
}

interface State {
  hideNlsr: boolean;
  hideKey: boolean;
  filter?: NameFilter;
}

const NLSR_ROUTER_COMP = NameComponent.from("%C1.Router");
const NLSR_OPERATOR_COMP = NameComponent.from("%C1.Operator");
const KEY_COMP = NameComponent.from("KEY");

export class NameFiltered extends Component<Props, State> {
  public componentDidMount() {
    try {
      const { hideNlsr, hideKey } = JSON.parse(getCookie("NameFiltered")!);
      this.setState({ hideNlsr: !!hideNlsr, hideKey: !!hideKey }, this.updateFilter);
    } catch {
      this.setState({ hideNlsr: false, hideKey: false }, this.updateFilter);
    }
  }

  private handleNlsrChange = () => {
    this.setState((prev) => ({ hideNlsr: !prev.hideNlsr }), this.updateFilter);
  };

  private handleKeyChange = () => {
    this.setState((prev) => ({ hideKey: !prev.hideKey }), this.updateFilter);
  };

  private updateFilter = () => {
    this.setState(({ hideNlsr, hideKey }) => {
      setCookie("NameFiltered", JSON.stringify({ hideNlsr, hideKey }), { path: "", sameSite: "Strict" });
      return {
        filter: (name: Name) => {
          switch (true) {
            case hideNlsr && (nameIncludes(name, NLSR_ROUTER_COMP) || nameIncludes(name, NLSR_OPERATOR_COMP)):
            case hideKey && nameIncludes(name, KEY_COMP):
              return false;
          }
          return true;
        },
      };
    });
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
              <input type="checkbox" checked={this.state.hideNlsr} onChange={this.handleNlsrChange}/>
              hide NLSR names
            </label>
            {" "}
            <label>
              <input type="checkbox" checked={this.state.hideKey} onChange={this.handleKeyChange}/>
              hide KEY names
            </label>
          </fieldset>
        </form>
        {this.props.children(this.state.filter)}
      </Fragment>
    );
  }
}

function nameIncludes(name: Name, needle: NameComponent): boolean {
  for (const comp of name.comps) {
    if (needle.equals(comp)) {
      return true;
    }
  }
  return false;
}
