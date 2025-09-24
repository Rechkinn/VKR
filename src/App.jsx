import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Header from "./components/Header/Header";

function App() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        // const url

        const res = await fetch("http://0.0.0.1:8000/api/health");
        alert("res", res);
        alert(
          `await fetch('http://0.0.0.1:8000/api/health')`,
          await fetch("http://0.0.0.1:8000/api/health")
        );
        // data = await res.json()
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <>
      {loading && <h1>LOADIND...</h1>}

      <Header />
      <>
        <div>
          <h1>Это будет второй коммит</h1>
          <h2>Это будет второй коммит</h2>
          <h3>Это будет второй коммит</h3>
          <h4>Это будет второй коммит</h4>
          <h5>Это будет второй коммит</h5>
          <h6>Это будет второй коммит</h6>
        </div>
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </>
    </>
  );
}

export default App;
