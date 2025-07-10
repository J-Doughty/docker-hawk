import "./App.css";
import { Link } from "@tanstack/react-router";

function App() {
  return (
    <main className="container">
      <h1>Docker Hawk</h1>
      <Link to="/about">Hi</Link>
      <Link to="/images/list">Images</Link>
    </main>
  );
}

export default App;
