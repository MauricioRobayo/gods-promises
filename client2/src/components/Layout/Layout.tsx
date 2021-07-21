import React from "react";
import styled from "styled-components";
import { Navbar } from "../Navbar";
import { Footer } from "../Footer";

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

type LayoutProps = {
  children?: React.ReactNode;
};
function Layout({ children }: LayoutProps) {
  return (
    <Wrapper>
      <StyledNavbar />
      <Main>{children}</Main>
      <Footer />
    </Wrapper>
  );
}

export default Layout;
