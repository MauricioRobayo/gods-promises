import RandomPassage from "./features/passages/RandomPassage";
import Twemoji from "./features/twemoji/Twemoji";
import styled from "styled-components/macro";

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
`;

const Title = styled.h1`
  margin: 2rem 0;
  font-weight: 900;
`;

function App() {
  return (
    <>
      <Main>
        <Title>
          <Twemoji emoji="🙏" /> God's Promises
        </Title>
        <RandomPassage />
      </Main>
    </>
  );
}

export default App;
