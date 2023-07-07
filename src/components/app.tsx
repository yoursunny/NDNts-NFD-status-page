import type { Name } from "@ndn/packet";
// @ts-expect-error typing unavailable
import { get as hashGet, set as hashSet } from "hashquery";
import { Component, Fragment, h } from "preact";

import { NavContext, type NavFuncs, NfdStatusContext, OldNfdStatusContext } from "../context";
import type { NfdStatusRequests } from "../model/nfd-status/requests";
import type { NfdStatus } from "../model/nfd-status/types";
import { About } from "./about";
import { Footer } from "./common/footer";
import { If } from "./common/if";
import { Loading } from "./common/loading";
import { NavMenu } from "./common/nav-menu";
import { FaceView } from "./face/view";
import { Overview } from "./overview";
import { RibView } from "./rib/view";
import { StrategyView } from "./strategy/view";

interface Props {
  requests: NfdStatusRequests;
}

interface State {
  status?: NfdStatus;
  currentTab: string;
  currentFace?: number;
  currentRibEntry?: Name;
}

export class App extends Component<Props, State> {
  constructor() {
    super();
    this.setState({ currentTab: hashGet("tab") || "Overview" });
  }

  public override componentDidMount() {
    this.props.requests.onFetched = (status) => this.setState({ status });
  }

  private nav: NavFuncs = {
    face: (id) => {
      this.setState({
        currentTab: "Faces",
        currentFace: id,
      });
    },
    rib: (name) => {
      this.setState({
        currentTab: "Routes",
        currentRibEntry: name,
      });
    },
    strategies: () => {
      this.setState({
        currentTab: "Strategies",
      });
    },
  };

  public override getSnapshotBeforeUpdate() {
    hashSet("tab", this.state.currentTab);
  }

  public render() {
    const { latest, oldest } = this.props.requests;
    if (!latest || !oldest) {
      return <Loading requests={this.props.requests}/>;
    }
    return (
      <NfdStatusContext.Provider value={latest}>
        <OldNfdStatusContext.Provider value={oldest}>
          <NavContext.Provider value={this.nav}>
            {this.renderView()}
          </NavContext.Provider>
        </OldNfdStatusContext.Provider>
      </NfdStatusContext.Provider>
    );
  }

  private renderView() {
    const { currentTab: tab } = this.state;
    const { version } = this.props.requests.latest!.host;
    return (
      <>
        <div class="pure-g">
          <div class="pure-u-1">
            <NavMenu
              tabs={["Overview", "Faces", "Routes", "Strategies", "About"]}
              selected={tab}
              onChange={(tab) => this.setState({ currentTab: tab })}
            >
              <span class="pure-menu-heading">NFD {version}</span>
            </NavMenu>
          </div>
        </div>
        <div class="pure-g">
          <section class="pure-u-1">
            <If show={tab === "Overview"}>
              <Overview/>
            </If>
            <If show={tab === "Faces"}>
              <FaceView selected={this.state.currentFace}/>
            </If>
            <If show={tab === "Routes"}>
              <RibView selected={this.state.currentRibEntry}/>
            </If>
            <If show={tab === "Strategies"}>
              <StrategyView/>
            </If>
            <If show={tab === "About"}>
              <About/>
            </If>
          </section>
        </div>
        <Footer requests={this.props.requests}/>
      </>
    );
  }
}
