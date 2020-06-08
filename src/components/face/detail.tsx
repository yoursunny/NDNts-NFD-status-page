import { AltUri } from "@ndn/packet";
import { toHex } from "@ndn/tlv";
import { Fragment, h } from "preact";
import { useContext } from "preact/hooks";

import { GotoRibContext, NfdStatusContext } from "../../context";
import type { Face, Route } from "../../model/nfd-status/types";
import { If } from "../common/if";
import { RouteDetail } from "../common/route";

interface Props {
  face: Face;
}

export function FaceDetail({ face }: Props) {
  const routes = useContext(NfdStatusContext).getFaceRoutes(face.id);
  return (
    <Fragment>
      <h2>Face {face.id}</h2>
      <table class="pure-table pure-table-bordered">
        <tr><td>local</td><td>{face.local}</td></tr>
        <tr><td>remote</td><td>{face.remote}</td></tr>
        <tr><td>RX</td><td>{face.cnt.rxInterest}I {face.cnt.rxData}D {face.cnt.rxNack}N</td></tr>
        <tr><td>TX</td><td>{face.cnt.txInterest}I {face.cnt.txData}D {face.cnt.txNack}N</td></tr>
      </table>
      <If show={routes.length > 0}>
        <h3>Routes</h3>
        <FaceRoutes routes={routes}/>
      </If>
    </Fragment>
  );
}

function FaceRoutes({ routes }: { routes: Route[] }) {
  const gotoRib = useContext(GotoRibContext);
  return (
    <table class="pure-table pure-table-bordered">
      <thead>
        <tr>
          <th>name</th>
          <th>origin</th>
          <th>cost</th>
        </tr>
      </thead>
      <tbody>
        {routes.map((route) => (
          <RouteDetail
            key={`${toHex(route.prefix.value)} ${route.origin}`}
            route={route} showFlags={false}
          >
            <td onClick={() => gotoRib(route.prefix)}>
              <a href="javascript:;">
                {AltUri.ofName(route.prefix)}
              </a>
            </td>
          </RouteDetail>
        ))}
      </tbody>
    </table>
  );
}
