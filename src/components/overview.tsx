import { Fragment, h } from "preact";
import { useContext } from "preact/hooks";
import prettyMilliseconds from "pretty-ms";

import { NavContext, NfdStatusContext } from "../context";

export function Overview() {
  const status = useContext(NfdStatusContext);
  const { host, faces, rib, routes, defaultStrategy } = status;
  const { cnt } = host;
  const nav = useContext(NavContext);
  return (
    <>
      <h1>NFD {host.version}</h1>
      <table class="pure-table pure-table-bordered">
        <tr>
          <td>uptime</td>
          <td>{prettyMilliseconds(status.timestamp - host.startTime)}</td>
        </tr>
        <tr>
          <td onClick={() => nav.face()}><a href="javascript:;">faces</a></td>
          <td>{faces.length}</td>
        </tr>
        <tr>
          <td>name tree</td>
          <td>{cnt.nameTreeEntry} entries</td>
        </tr>
        <tr>
          <td>FIB</td>
          <td>{cnt.fibEntry} entries</td>
        </tr>
        <tr>
          <td>PIT</td>
          <td>{cnt.pitEntry} entries, {cnt.pitSatisfy} satisfied, {cnt.pitUnsatisfy} unsatisfied</td>
        </tr>
        <tr>
          <td>CS</td>
          <td>{cnt.csEntry} entries, {cnt.csHit} hits, {cnt.csMiss} misses</td>
        </tr>
        <tr>
          <td onClick={() => nav.rib()}><a href="javascript:;">RIB</a></td>
          <td>{rib.length} entries, {routes.length} routes</td>
        </tr>
        <tr>
          <td onClick={() => nav.strategies()}><a href="javascript:;">strategy</a></td>
          <td>{defaultStrategy}</td>
        </tr>
      </table>
    </>
  );
}
