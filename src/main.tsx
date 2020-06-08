import "purecss";
import "purecss/build/grids-responsive-min.css";
import "./style.css";

import { h, render } from "preact";
import qs from "qs";

import { App } from "./components/app";

window.addEventListener("load", () => {
  const { uri = "/", interval } = qs.parse(location.search, { depth: 1, ignoreQueryPrefix: true });
  let intervalMs = Number.parseInt(interval?.toString() ?? "", 10);
  if (!intervalMs || intervalMs < 2000) {
    intervalMs = 2000;
  }
  render(<App uri={uri.toString()} interval={intervalMs}/>, document.body);
});
