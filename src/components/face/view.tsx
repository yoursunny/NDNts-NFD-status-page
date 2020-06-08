import { h } from "preact";
import { useContext } from "preact/hooks";

import { NfdStatusContext } from "../../context";
import { If } from "../common/if";
import { FaceDetail } from "./detail";
import { FaceTable } from "./table";

interface Props {
  selected?: number;
}

export function FaceView({ selected }: Props) {
  const status = useContext(NfdStatusContext);
  const face = selected ? status.getFace(selected) : undefined;
  return (
    <div class="pure-g">
      <div class="pure-u-1 pure-u-lg-11-24">
        <h1>{status.faces.length} faces</h1>
        <FaceTable selected={selected}/>
      </div>
      <div class="pure-u-1 pure-u-lg-1-24"/>
      <div class="pure-u-1 pure-u-lg-12-24">
        <If show={!!face}>
          <FaceDetail face={face!}/>
        </If>
      </div>
    </div>
  );
}
