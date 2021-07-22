import useTranslation from "next-translate/useTranslation";
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
  const { t } = useTranslation();
  return (
    <StyledFooter>
      <a href="https://godspromises.bible">
        <Twemoji emoji="🙏" /> {t("common:God's Promises")}
      </a>
    </StyledFooter>
  );
}

export default Footer;
