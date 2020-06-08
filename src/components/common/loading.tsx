import { Fragment, h } from "preact";

import type { NfdStatusRequests } from "../../model/nfd-status/requests";
import { Footer } from "./footer";
import { NavMenu } from "./nav-menu";

interface Props {
  requests: NfdStatusRequests;
}

export function Loading({ requests }: Props) {
  return (
    <Fragment>
      <div class="pure-g">
        <div class="pure-u-1">
          <NavMenu tabs={[]}>
            <span class="pure-menu-heading">NFD Status Page</span>
          </NavMenu>
        </div>
      </div>
      <div class="pure-g">
        <section class="pure-u-1">
          <h1>Loading {requests.uri}</h1>
        </section>
      </div>
      <Footer requests={requests}/>
    </Fragment>
  );
}
