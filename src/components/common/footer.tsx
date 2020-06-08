import { Component, Fragment, h } from "preact";
import prettyMilliseconds from "pretty-ms";

interface Props {
  uri: string;
  interval: number;
}

export function Footer({ uri, interval }: Props) {
  return (
    <footer class="pure-g">
      <div class="pure-u-1-2">NFD status page, powered by NDNts</div>
      <div class="pure-u-1-2">
        {uri === "/" ? location.hostname : uri},
        refresh every {prettyMilliseconds(interval)}
      </div>
    </footer>
  );
}
