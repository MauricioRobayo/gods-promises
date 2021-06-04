import RandomPromise from "./features/promises/RandomPromise";
import Twemoji from "./features/twemoji/Twemoji";
import styled from "styled-components/macro";

const Main = styled.main`
  max-width: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-family: "Signika Negative", serif;
  font-weight: bold;
`;

function App() {
  return (
    <>
      <Main>
        <Title>
          <Twemoji emoji="🙏" /> God's Promises
        </Title>
        <RandomPromise />
      </Main>
    </>
  );
}

export default App;
