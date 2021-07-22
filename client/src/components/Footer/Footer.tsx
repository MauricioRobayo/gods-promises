import Link from "next/link";
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
      <Link href="/">
        <a>
          <Logo />
        </a>
      </Link>
    </StyledFooter>
  );
}

export default Footer;
