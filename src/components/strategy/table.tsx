import { AltUri } from "@ndn/packet";
import { toHex } from "@ndn/tlv";
import { h } from "preact";
import { useContext } from "preact/hooks";

import { NfdStatusContext } from "../../context";
import type { NameFilter } from "../common/name-filtered";

interface Props {
  filter: NameFilter;
}

export function StrategyTable({ filter }: Props) {
  const { strategies } = useContext(NfdStatusContext);
  return (
    <table class="pure-table pure-table-bordered">
      <thead>
        <tr>
          <th>name</th>
          <th>strategy</th>
        </tr>
      </thead>
      {strategies.filter(({ prefix }) => filter(prefix)).map((sc) => (
        <tr key={toHex(sc.prefix.value)}>
          <td>{AltUri.ofName(sc.prefix)}</td>
          <td>{sc.strategy}</td>
        </tr>
      ))}
    </table>
  );
}
