import type { Name } from "@ndn/packet";
import { Component, Fragment, h } from "preact";

import { GotoFaceContext, GotoRibContext, GotoStrategiesContext, NfdStatusContext } from "../context";
import type { NfdStatus } from "../model/nfd-status/types";
import { parseNfdStatusXml } from "../model/nfd-status/xml";
import { If } from "./common/if";
import { NavMenu } from "./common/nav-menu";
import { FaceView } from "./face/view";
import { Overview } from "./overview";
import { RibView } from "./rib/view";
import { StrategyView } from "./strategy";

interface Props {
  uri: string;
  interval: number;
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

  private timer = 0;

  private update = async () => {
    const xml = await fetch(this.props.uri).then((r) => r.text());
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    const status = parseNfdStatusXml(doc);
    this.setState({ status });
  };

  public componentDidMount() {
    setTimeout(this.update, 0);
    this.timer = setInterval(this.update, this.props.interval);
  }

  public componentWillUnmount() {
    clearInterval(this.timer);
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
    const { status } = this.state;
    if (!status) {
      return <h1>loading</h1>;
    }
    return (
      <NfdStatusContext.Provider value={status}>
        <GotoFaceContext.Provider value={this.gotoFace}>
          <GotoRibContext.Provider value={this.gotoRib}>
            <GotoStrategiesContext.Provider value={this.gotoStrategies}>
              {this.renderView()}
            </GotoStrategiesContext.Provider>
          </GotoRibContext.Provider>
        </GotoFaceContext.Provider>
      </NfdStatusContext.Provider>
    );
  }

  private renderView() {
    const { currentTab: tab } = this.state;
    const { host } = this.state.status!;
    return (
      <Fragment>
        <div class="pure-g">
          <div class="pure-u-1">
            <NavMenu
              tabs={["Overview", "Faces", "Routes", "Strategies"]}
              selected={tab}
              onChange={(tab) => this.setState({ currentTab: tab })}
            >
              <span class="pure-menu-heading">NFD {host.version}</span>
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
        <footer class="pure-g">
          <div class="pure-u-1">NFD status page, powered by NDNts</div>
        </footer>
      </Fragment>
    );
  }
}
