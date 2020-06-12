import type { Component, Name } from "@ndn/packet";

export function nameIncludes(name: Name, needle: Component): boolean {
  for (const comp of name.comps) {
    if (needle.equals(comp)) {
      return true;
    }
  }
  return false;
}
