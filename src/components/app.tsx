import type { Name } from "@ndn/packet";
import { Component, Fragment, h } from "preact";

import { GotoFaceContext, GotoRibContext, GotoStrategiesContext, NfdStatusContext, OldNfdStatusContext } from "../context";
import type { NfdStatusRequests } from "../model/nfd-status/requests";
import type { NfdStatus } from "../model/nfd-status/types";
import { Footer } from "./common/footer";
import { If } from "./common/if";
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
    this.setState({ currentTab: "Overview" });
  }

  public componentDidMount() {
    this.props.requests.onFetched = (status) => this.setState({ status });
  }

  private gotoFace = (id?: number) => {
    this.setState({
      currentTab: "Faces",
      currentFace: id,
    });
  };

  private gotoRib = (name?: Name) => {
    this.setState({
      currentTab: "Routes",
      currentRibEntry: name,
    });
  };

  private gotoStrategies = () => {
    this.setState({
      currentTab: "Strategies",
    });
  };

  public render() {
    const { latest, oldest } = this.props.requests;
    if (!latest || !oldest) {
      return <h1>loading</h1>;
    }
    return (
      <NfdStatusContext.Provider value={latest}>
        <OldNfdStatusContext.Provider value={oldest}>
          <GotoFaceContext.Provider value={this.gotoFace}>
            <GotoRibContext.Provider value={this.gotoRib}>
              <GotoStrategiesContext.Provider value={this.gotoStrategies}>
                {this.renderView()}
              </GotoStrategiesContext.Provider>
            </GotoRibContext.Provider>
          </GotoFaceContext.Provider>
        </OldNfdStatusContext.Provider>
      </NfdStatusContext.Provider>
    );
  }

  private renderView() {
    const { currentTab: tab } = this.state;
    const version = this.props.requests.latest!.host.version;
    return (
      <Fragment>
        <div class="pure-g">
          <div class="pure-u-1">
            <NavMenu
              tabs={["Overview", "Faces", "Routes", "Strategies"]}
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
          </section>
        </div>
        <Footer uri={this.props.requests.uri} interval={this.props.requests.interval}/>
      </Fragment>
    );
  }
}
