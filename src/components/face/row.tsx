import classNames from "classnames";
import { h } from "preact";
import { useContext } from "preact/hooks";

import { NfdStatusContext } from "../../context";
import type { Face } from "../../model/nfd-status/types";

interface Props {
  face: Face;
  highlight?: boolean;
  onClick?: () => void;
}

export function FaceRow({ face, highlight, onClick }: Props) {
  const routes = useContext(NfdStatusContext).getFaceRoutes(face.id);
  return (
    <tr class={classNames({ "pure-table-odd": highlight })}>
      <td onClick={onClick}>
        <a href="javascript:;">
          {face.id}
        </a>
      </td>
      <td>{face.title}</td>
      <td>{routes.length}</td>
    </tr>
  );
}
