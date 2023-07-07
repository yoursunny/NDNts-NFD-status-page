import { AltUri } from "@ndn/naming-convention2";
import { Fragment, h } from "preact";
import { useContext } from "preact/hooks";

import { NavContext, NfdStatusContext } from "../../context";
import type { RibEntry } from "../../model/nfd-status/types";
import { RouteDetail } from "../common/route";

interface Props {
  entry: RibEntry;
}

export function RibDetail({ entry }: Props) {
  const status = useContext(NfdStatusContext);
  const nav = useContext(NavContext);
  const { prefix, routes } = entry;
  return (
    <>
      <h2>RIB entry {AltUri.ofName(prefix)}</h2>
      <table class="pure-table pure-table-bordered">
        <thead>
          <tr>
            <th colSpan={2}>face</th>
            <th>origin</th>
            <th>cost</th>
            <th>flags</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <RouteDetail key={`${route.nexthop} ${route.origin}`} route={route}>
              <td onClick={() => nav.face(route.nexthop)}>
                <a href="javascript:;">{route.nexthop}</a>
              </td>
              <td>{status.getFace(route.nexthop)?.title}</td>
            </RouteDetail>
          ))}
        </tbody>
      </table>
    </>
  );
}

