import { AltUri } from "@ndn/packet";
import { toHex } from "@ndn/tlv";
import { Fragment, h } from "preact";
import { useContext } from "preact/hooks";
import prettyMilliseconds from "pretty-ms";

import { GotoFaceContext, GotoRibContext, NfdStatusContext } from "../context";

export function StrategyView() {
  const { strategies } = useContext(NfdStatusContext);
  return (
    <Fragment>
      <h1>{strategies.length} strategy choices</h1>
      <table class="pure-table pure-table-bordered">
        <thead>
          <tr>
            <th>name</th>
            <th>strategy</th>
          </tr>
        </thead>
        {strategies.map((sc) => (
          <tr key={toHex(sc.prefix.value)}>
            <td>{AltUri.ofName(sc.prefix)}</td>
            <td>{sc.strategy}</td>
          </tr>
        ))}
      </table>
    </Fragment>
  );
}
