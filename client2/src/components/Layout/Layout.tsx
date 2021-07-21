import React from "react";
import styled from "styled-components";
import { Navbar } from "../Navbar";
import { Twemoji } from "../Twemoji";

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
`;

const StyledNavbar = styled(Navbar)`
  margin-bottom: 2rem;
  position: relative;
  z-index: 0;
`;

const Main = styled.main`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  place-items: center;
  overflow: hidden;
`;

const Footer = styled.footer`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 1rem 0;
  a {
    color: ${({ theme }) => theme.color.text2};
  }
`;

type LayoutProps = {
  children?: React.ReactNode;
};
function Layout({ children }: LayoutProps) {
  return (
    <Wrapper>
      <StyledNavbar />
      <Main>{children}</Main>
      <Footer>
        <a href="https://godspromises.bible">
          <Twemoji emoji="🙏" /> God&apos;s Promises
        </a>
      </Footer>
    </Wrapper>
  );
}

export default Layout;
