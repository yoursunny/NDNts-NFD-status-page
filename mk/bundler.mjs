import { execaCommandSync, execaNode } from "execa";

const { stdout: commit } = execaCommandSync("git describe --match=NeVeRmAtCh --always --abbrev=40 --dirty");

execaNode("./node_modules/parcel/lib/bin.js", process.argv.slice(2), {
  extendEnv: false,
  env: {
    GIT_COMMIT: commit,
  },
  stdio: "inherit",
});
