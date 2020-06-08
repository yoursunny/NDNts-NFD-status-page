import { h } from "preact";
import prettyMilliseconds from "pretty-ms";

import type { NfdStatusRequests } from "../../model/nfd-status/requests";

interface Props {
  requests: NfdStatusRequests;
}

export function Footer({ requests: { uri, interval } }: Props) {
  return (
    <footer class="pure-g">
      <div class="pure-u-1">
        NFD status page,
        {" "}
        {uri === "/" ? location.hostname : uri},
        refreshing every {prettyMilliseconds(interval)}
      </div>
    </footer>
  );
}
