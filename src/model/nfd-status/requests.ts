import { pEvent } from "p-event";

import { type NfdStatus } from "./types";
import { parseNfdStatusXml } from "./xml";

interface Options {
  uri: string;
  interval: number;
  history: number;
}

export class NfdStatusRequests {
  constructor(opts: Options) {
    Object.assign(this, opts);
  }

  public onFetched?: (latest: NfdStatus) => void;

  public get host(): string {
    if (this.uri === "/") {
      return location.hostname;
    }
    return this.uri;
  }

  private timer: number | NodeJS.Timeout = 0;
  private recents: NfdStatus[] = [];

  public get latest(): NfdStatus | undefined {
    return this.recents[0];
  }

  public get oldest(): NfdStatus | undefined {
    return this.recents.at(-1);
  }

  public start(): void {
    this.timer = setTimeout(this.update, 0);
  }

  public stop(): void {
    clearTimeout(this.timer);
  }

  private update = async () => {
    try {
      if (document.hidden) {
        await pEvent(document, "visibilitychange");
      }

      const request = new Request(this.uri);
      request.headers.set("Accept", "application/xml; text/xml; */*");
      const response = await fetch(request);
      const doc = new DOMParser().parseFromString(await response.text(), "application/xml");
      const status = parseNfdStatusXml(doc);
      this.recents.unshift(status);
      this.recents.splice(this.history);
      this.onFetched?.(status);
    } catch (err: unknown) {
      console.warn(err);
    } finally {
      this.timer = setTimeout(this.update, this.interval + this.interval * 0.1 * Math.random());
    }
  };
}

export interface NfdStatusRequests extends Options {}
