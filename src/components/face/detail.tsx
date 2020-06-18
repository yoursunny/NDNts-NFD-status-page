import { AltUri } from "@ndn/packet";
import { toHex } from "@ndn/tlv";
import { Fragment, h } from "preact";
import { useContext } from "preact/hooks";

import { GotoRibContext, NfdStatusContext, OldNfdStatusContext } from "../../context";
import type { Face, FaceFlag, PacketCounters, Route } from "../../model/nfd-status/types";
import { If } from "../common/if";
import { RouteDetail } from "../common/route";

interface Props {
  face: Face;
}

const counterColumns: Record<keyof PacketCounters, string> = {
  rxInterest: "RX Interest",
  rxData: "RX Data",
  rxNack: "RX Nack",
  txInterest: "TX Interest",
  txData: "TX Data",
  txNack: "TX Nack",
};

export function FaceDetail({ face }: Props) {
  const status = useContext(NfdStatusContext);
  const routes = status.getFaceRoutes(face.id);
  const traffic = status.diffFaceCounters(face, useContext(OldNfdStatusContext));
  return (
    <Fragment>
      <h2>Face {face.id}</h2>
      <table class="pure-table pure-table-bordered">
        <tr><td>local</td><td colSpan={2}>{face.local}</td></tr>
        <tr><td>remote</td><td colSpan={2}>{face.remote}</td></tr>
        <tr><td>MTU</td><td colSpan={2}>{face.mtu}</td></tr>
        <tr><td>flags</td><td colSpan={2}><FaceFlags flags={face.flags}/></td></tr>
        {(Object.entries(counterColumns) as Array<[keyof PacketCounters, string]>).map(([key, title]) => (
          <tr key={key}>
            <td>{title}</td>
            <td>{face.cnt[key]}</td>
            <td>{traffic[key].toFixed(2)} /s</td>
          </tr>
        ))}
      </table>
      <If show={routes.length > 0}>
        <h3>Routes</h3>
        <FaceRoutes routes={routes}/>
      </If>
    </Fragment>
  );
}

const flagDisplay: Record<FaceFlag, [string, string]> = {
  local: ["L", "ff851b"],
  "on-demand": ["OD", "7fdbff"],
  permanent: ["P", "01ff70"],
  "multi-access": ["M", "f012be"],
  "congestion-marking": ["CM", "b10dc9"],
};

function FaceFlags({ flags }: { flags: FaceFlag[] }) {
  return (
    <Fragment>
      {flags.map((flag) => {
        const [label, color] = flagDisplay[flag];
        return <i key={flag} title={flag} class="flag" style={`background:#${color};`}>{label}</i>;
      })}
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
