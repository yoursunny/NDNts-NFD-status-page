import { NfdStatus } from "./types";
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

  private timer = 0;
  private recents: NfdStatus[] = [];

  public get latest(): NfdStatus | undefined {
    return this.recents[0];
  }

  public get oldest(): NfdStatus | undefined {
    return this.recents[this.recents.length - 1];
  }

  public start(): void {
    this.timer = setTimeout(this.update, 0);
  }

  public stop(): void {
    clearTimeout(this.timer);
  }

  private update = () => {
    (async () => {
      if (document.hidden) {
        await new Promise((r) => document.addEventListener("visibilitychange", r));
      }

      const request = new Request(this.uri);
      request.headers.set("Accept", "application/xml; text/xml; */*");
      const xml = await fetch(request).then((r) => r.text());
      const doc = new DOMParser().parseFromString(xml, "application/xml");
      const status = parseNfdStatusXml(doc);
      this.recents.unshift(status);
      this.recents.splice(this.history, Infinity);
      this.onFetched?.(status);
    })()
      .catch(console.warn)
      .finally(() => {
        this.timer = setTimeout(this.update, this.interval);
      });
  };
}
export interface NfdStatusRequests extends Options {}
