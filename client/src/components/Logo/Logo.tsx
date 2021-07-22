import useTranslation from "next-translate/useTranslation";
import styled from "styled-components";
import { Twemoji } from "../Twemoji";

const Wrapper = styled.div``;

export default function Logo() {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <Twemoji emoji="🙏" /> {t("common:God's Promises")}
    </Wrapper>
  );
}
