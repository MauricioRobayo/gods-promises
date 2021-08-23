import Link from "next/link";
import { Email } from "react-obfuscate-email";
import styled from "styled-components";
import Logo from "../Logo/Logo";

const StyledFooter = styled.footer`
  display: grid;
  place-items: center;
  padding: 1rem 0;
  a {
    color: ${({ theme }) => theme.color.text2};
  }
  p {
    margin: 0.5rem 0;
  }
`;

function Footer() {
  return (
    <StyledFooter>
      <p>
        <Link href="/">
          <a>
            <Logo />
          </a>
        </Link>
      </p>
      <p>
        <Email email="info@godspromises.bible" />
      </p>
    </StyledFooter>
  );
}

export default Footer;
