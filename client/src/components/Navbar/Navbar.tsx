import React from "react";
import styled from "styled-components";
import { LanguageSelector } from "../i18n";
import Logo from "../Logo/Logo";

const StyledNavbar = styled.nav`
  display: flex;
  padding: 0.5rem;
  justify-content: center;
  @media ${({ theme }) => theme.device.small} {
    padding: 1rem;
  }
  border-bottom: 2px solid ${({ theme }) => theme.color.surface3};
`;

const NavbarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: ${({ theme }) => theme.size.medium};
  width: 100%;
`;

const Title = styled.h1`
  font-size: 1.25rem;

  @media ${({ theme }) => theme.device.medium} {
    font-size: 1.75rem;
  }
  margin: 0;
  font-weight: 900;
  a {
    color: ${({ theme }) => theme.color.text1};
  }
`;

type NavbarProps = {
  className?: string;
};
function Navbar({ className = "" }: NavbarProps) {
  return (
    <StyledNavbar className={className}>
      <NavbarWrapper>
        <Title>
          <a href="https://godspromises.bible">
            <Logo />
          </a>
        </Title>
        <LanguageSelector />
      </NavbarWrapper>
    </StyledNavbar>
  );
}

export default Navbar;
