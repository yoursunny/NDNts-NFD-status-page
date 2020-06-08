const { fork } = require("child_process");

fork("./node_modules/parcel-bundler/bin/cli.js", process.argv.slice(2), {
  env: {},
  stdio: "inherit",
});
