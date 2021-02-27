import classNames from "classnames";
import { h } from "preact";
import { useContext } from "preact/hooks";

import { NfdStatusContext, OldNfdStatusContext } from "../../context";
import type { Face } from "../../model/nfd-status/types";

interface Props {
  face: Face;
  highlight?: boolean;
  onClick?: () => void;
}

export function FaceRow({ face, highlight, onClick }: Props) {
  const status = useContext(NfdStatusContext);
  const routes = status.getFaceRoutes(face.id);
  const traffic = status.diffFaceCounters(face, useContext(OldNfdStatusContext));
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  const trafficSum: number = Object.values(traffic).reduce((sum, v) => sum + v, 0);
  return (
    <tr class={classNames({ "pure-table-odd": highlight })}>
      <td onClick={onClick}>
        <a href="javascript:;">
          {face.id}
        </a>
      </td>
      <td>{face.title}</td>
      <td>{routes.length}</td>
      <td>{Math.ceil(trafficSum)}</td>
    </tr>
  );
}
