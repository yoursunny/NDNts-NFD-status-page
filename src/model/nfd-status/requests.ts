import { NfdStatus } from "./types";
import { parseNfdStatusXml } from "./xml";

export class NfdStatusRequests {
  constructor(
      public readonly uri: string,
      public readonly interval: number,
      public readonly buffered: number,
  ) {
  }

  public onFetched?: (latest: NfdStatus) => void;

  private timer = 0;
  private recents: NfdStatus[] = [];

  public get latest(): NfdStatus|undefined {
    return this.recents[0];
  }

  public get oldest(): NfdStatus|undefined {
    return this.recents[this.recents.length - 1];
  }

  public start(): void {
    this.update();
    this.timer = setInterval(this.update, this.interval);
  }

  public stop(): void {
    clearInterval(this.timer);
  }

  private update = () => {
    (async () => {
      const request = new Request(this.uri);
      request.headers.set("Accept", "application/xml; text/xml; */*");
      const xml = await fetch(request).then((r) => r.text());
      const doc = new DOMParser().parseFromString(xml, "application/xml");
      const status = parseNfdStatusXml(doc);
      this.recents.unshift(status);
      this.recents.splice(this.buffered, Infinity);
      this.onFetched?.(status);
    })().catch(console.warn);
  };
}
