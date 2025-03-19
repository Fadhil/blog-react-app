import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Hello World!</h2>
        <p>This is a test of Argo CD again</p>
        <p>Now let's see if it does a rollout automatically</p>
        <p>It doesn't. Let's try and manually trigger a rollout</p>
      </header>
    </div>
  );
}

export default App;
