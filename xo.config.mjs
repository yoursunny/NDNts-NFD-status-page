import { js, merge, preact, ts } from "@yoursunny/xo-config";

/** @type {import("xo").FlatXoConfig} */
const config = [
  js,
  {
    files: [
      "src/**/*.{ts,tsx}",
    ],
    ...merge(ts, preact),
  },
];

export default config;
