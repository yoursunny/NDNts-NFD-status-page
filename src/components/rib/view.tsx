import type { Name } from "@ndn/packet";
import { h } from "preact";
import { useContext } from "preact/hooks";

import { NfdStatusContext } from "../../context";
import { If } from "../common/if";
import { RibDetail } from "./detail";
import { RibTable } from "./table";

interface Props {
  selected?: Name;
}

export function RibView({ selected }: Props) {
  const status = useContext(NfdStatusContext);
  const entry = selected ? status.getRibEntry(selected) : undefined;
  return (
    <div class="pure-g">
      <div class="pure-u-1 pure-u-lg-9-24">
        <h1>{status.routes.length} routes in {status.rib.length} RIB entries</h1>
        <RibTable selected={selected}/>
      </div>
      <div class="pure-u-1 pure-u-lg-1-24"/>
      <div class="pure-u-1 pure-u-lg-14-24">
        <If show={!!entry}>
          <RibDetail entry={entry!}/>
        </If>
      </div>
    </div>
  );
}
