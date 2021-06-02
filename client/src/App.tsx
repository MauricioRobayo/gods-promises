import RandomPromise from "./features/promises/RandomPromise";
import Twemoji from "./features/twemoji/Twemoji";

function App() {
  return (
    <>
      <main>
        <h1>
          Promises of God
          <Twemoji emoji="🙏" />
        </h1>
        <RandomPromise />
      </main>
    </>
  );
}

export default App;
