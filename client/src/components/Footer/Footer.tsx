import styled from "styled-components";
import { Twemoji } from "../Twemoji";

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
        <Twemoji emoji="🙏" /> God&apos;s Promises
      </a>
    </StyledFooter>
  );
}

export default Footer;
