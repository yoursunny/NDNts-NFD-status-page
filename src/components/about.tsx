import { Fragment, h } from "preact";

export function About() {
  const version = process.env.GIT_COMMIT;
  return (
    <>
      <h1>About NDNts NFD Status Page</h1>
      <ul style="line-height:2em;">
        <li><a href="https://yoursunny.com/p/NDNts/NFD-status-page/">Project Homepage</a></li>
        <li><a href="https://github.com/yoursunny/NDNts-NFD-status-page">GitHub repository</a></li>
        <li>NDNts NFD Status Page version {version}</li>
        <li>Powered by <a href="https://yoursunny.com/p/NDNts/">NDNts</a> and modern web technologies</li>
      </ul>
    </>
  );
}
