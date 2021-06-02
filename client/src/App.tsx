import axios from "axios";
import RandomPromise from "./features/promises/RandomPromise";
import { ReactQueryDevtools } from "react-query/devtools";

function App() {
  return (
    <div>
      Promises of God
      <RandomPromise />
      <ReactQueryDevtools />
    </div>
  );
}

export default App;
