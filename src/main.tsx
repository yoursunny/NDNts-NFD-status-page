import "purecss";
import "purecss/build/grids-responsive-min.css";
import "./style.css";

import { h, render } from "preact";
import qs from "qs";

import { App } from "./components/app";
import { NfdStatusRequests } from "./model/nfd-status/requests";

window.addEventListener("load", () => {
  const { uri = "/", interval } = qs.parse(location.search, { depth: 1, ignoreQueryPrefix: true });
  let intervalMs = Number.parseInt(interval?.toString() ?? "", 10) * 1000;
  if (!intervalMs || intervalMs < 6000) {
    intervalMs = 6000;
  }

  const requests = new NfdStatusRequests({
    uri: uri.toString(),
    interval: intervalMs,
    history: Math.ceil(30000 / intervalMs),
  });
  document.title = `NFD Status: ${requests.host}`;
  requests.start();
  render(<App requests={requests}/>, document.body);
});
