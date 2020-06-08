import { h } from "preact";
import { useContext } from "preact/hooks";

import { GotoFaceContext, NfdStatusContext } from "../../context";
import { FaceRow } from "./row";

interface Props {
  selected?: number;
}

export function FaceTable({ selected }: Props) {
  const { faces } = useContext(NfdStatusContext);
  const gotoFace = useContext(GotoFaceContext);
  return (
    <table class="pure-table pure-table-bordered">
      <thead>
        <tr>
          <th>id</th>
          <th>title</th>
          <th>routes</th>
        </tr>
      </thead>
      <tbody>
        {
          faces.map((face) => (
            <FaceRow
              key={face.id} face={face} highlight={face.id === selected}
              onClick={() => gotoFace(face.id)}
            />
          ))
        }
      </tbody>
    </table>
  );
}
