import type { Name } from "@ndn/packet";
import { toHex } from "@ndn/tlv";
import { h } from "preact";
import { useContext } from "preact/hooks";

import { GotoRibContext, NfdStatusContext } from "../../context";
import { RibRow } from "./row";

interface Props {
  selected?: Name;
  onSelect?: (name: Name) => void;
}

export function RibTable({ selected, onSelect }: Props) {
  const { rib } = useContext(NfdStatusContext);
  const gotoRib = useContext(GotoRibContext);
  return (
    <table class="pure-table pure-table-bordered">
      <thead>
        <tr>
          <th>prefix</th>
          <th>routes</th>
        </tr>
      </thead>
      <tbody>
        {
          rib.map((entry) => (
            <RibRow
              key={toHex(entry.prefix.value)} entry={entry}
              highlight={selected?.equals(entry.prefix)}
              onClick={() => gotoRib(entry.prefix)}
            />
          ))
        }
      </tbody>
    </table>
  );
}
