import { h } from "preact";
import { useContext } from "preact/hooks";

import { NavContext, NfdStatusContext } from "../../context";
import { FaceRow } from "./row";

interface Props {
  selected?: number;
}

export function FaceTable({ selected }: Props) {
  const { faces } = useContext(NfdStatusContext);
  const nav = useContext(NavContext);
  return (
    <table class="pure-table pure-table-bordered">
      <thead>
        <tr>
          <th>id</th>
          <th>title</th>
          <th>routes</th>
          <th>traffic</th>
        </tr>
      </thead>
      <tbody>
        {
          faces.map((face) => (
            <FaceRow
              key={face.id} face={face} highlight={face.id === selected}
              onClick={() => nav.face(face.id)}
            />
          ))
        }
      </tbody>
    </table>
  );
}
