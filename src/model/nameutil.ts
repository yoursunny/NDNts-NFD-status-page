import type { Component, Name } from "@ndn/packet";

export function nameIncludes(name: Name, needle: Component): boolean {
  return name.comps.some((comp) => comp.equals(needle));
}
