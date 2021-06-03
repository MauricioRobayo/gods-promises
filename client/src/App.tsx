import RandomPromise from "./features/promises/RandomPromise";
import Twemoji from "./features/twemoji/Twemoji";
import styled from "styled-components/macro";

const Title = styled.h1`
  font-family: "Signika Negative", serif;
  font-weight: bold;
`;

function App() {
  return (
    <>
      <main>
        <Title>
          <Twemoji emoji="🙏" /> God's Promises
        </Title>
        <RandomPromise />
      </main>
    </>
  );
}

export default App;
