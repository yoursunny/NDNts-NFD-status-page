import { type NfdStatus } from "./types";
import { parseNfdStatusXml } from "./xml";

interface Options {
  uri: string;
  interval: number;
  history: number;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
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
    return this.recents[this.recents.length - 1];
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
    } catch (err: unknown) {
      console.warn(err);
    } finally {
      this.timer = setTimeout(this.update, this.interval + this.interval * 0.1 * Math.random());
    }
  };
}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface NfdStatusRequests extends Options {}
