const execa = require("execa");

const { stdout: commit } = execa.sync("git describe --match=NeVeRmAtCh --always --abbrev=40 --dirty");

execa.node("./node_modules/parcel-bundler/bin/cli.js", process.argv.slice(2), {
  extendEnv: false,
  env: {
    GIT_COMMIT: commit,
  },
  stdio: "inherit",
});
