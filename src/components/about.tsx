import { Fragment, h } from "preact";

export function About() {
  return (
    <Fragment>
      <h1>About NFD Status Page</h1>
      <ul style="line-height:2em;">
        <li><a href="https://github.com/yoursunny/NDNts-NFD-status-page">GitHub repository</a></li>
        <li>NFD Status Page version {process.env.GIT_COMMIT}</li>
        <li>Powered by <a href="https://yoursunny.com/p/NDNts/">NDNts</a></li>
      </ul>
    </Fragment>
  );
}