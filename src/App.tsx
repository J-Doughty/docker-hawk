import { Link } from "@tanstack/react-router";

function App() {
  return (
    <section>
      <h1>Docker Hawk</h1>
      <Link to="/about">Hi</Link>
      <Link to="/images/list">Images</Link>
    </section>
  );
}

export default App;
