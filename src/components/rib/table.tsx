import type { Name } from "@ndn/packet";
import { h } from "preact";
import { useContext } from "preact/hooks";

import { GotoRibContext, NfdStatusContext } from "../../context";
import type { NameFilter } from "../common/name-filtered";
import { RibRow } from "./row";

interface Props {
  selected?: Name;
  filter: NameFilter;
}

export function RibTable({ selected, filter }: Props) {
  const { rib } = useContext(NfdStatusContext);
  const gotoRib = useContext(GotoRibContext);
  return (
    <table class="pure-table pure-table-bordered" style="table-layout:fixed; word-break:break-all;">
      <colgroup>
        <col style="width:80%;"/>
        <col style="width:20%;"/>
      </colgroup>
      <thead>
        <tr>
          <th>prefix</th>
          <th>routes</th>
        </tr>
      </thead>
      <tbody>
        {
          rib.filter(({ prefix }) => filter(prefix)).map((entry) => (
            <RibRow
              key={entry.prefix.valueHex} entry={entry}
              highlight={selected?.equals(entry.prefix)}
              onClick={() => gotoRib(entry.prefix)}
            />
          ))
        }
      </tbody>
    </table>
  );
}
