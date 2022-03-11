import { AltUri } from "@ndn/naming-convention2";
import classNames from "classnames";
import { h } from "preact";

import type { RibEntry } from "../../model/nfd-status/types";

interface Props {
  entry: RibEntry;
  highlight?: boolean;
  onClick?: () => void;
}

export function RibRow({ entry, highlight, onClick }: Props) {
  return (
    <tr class={classNames({ "pure-table-odd": highlight })}>
      <td onClick={onClick}>
        <a href="javascript:;">
          {AltUri.ofName(entry.prefix)}
        </a>
      </td>
      <td>{entry.routes.length}</td>
    </tr>
  );
}
