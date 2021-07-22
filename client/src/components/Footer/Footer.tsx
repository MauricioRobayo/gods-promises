import styled from "styled-components";
import Logo from "../Logo/Logo";

const StyledFooter = styled.footer`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 1rem 0;
  a {
    color: ${({ theme }) => theme.color.text2};
  }
`;

function Footer() {
  return (
    <StyledFooter>
      <a href="https://godspromises.bible">
        <Logo />
      </a>
    </StyledFooter>
  );
}

export default Footer;
