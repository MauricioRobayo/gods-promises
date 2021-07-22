import useTranslation from "next-translate/useTranslation";
import { Twemoji } from "../components/Twemoji";
import {
  Wrapper,
  Button,
  Angel,
  Tagline,
  Blockquote,
  Figcaption,
} from "./index.styles";

export default function Home() {
  const { t } = useTranslation("home");

  return (
    <Wrapper>
      <Angel>
        <Twemoji emoji="👼" height={"4rem"} />
      </Angel>
      <Tagline>
        <Blockquote>{t("intro")}</Blockquote>
        <Figcaption>{t("author")}</Figcaption>
      </Tagline>
      <Button title={t("start")}>
        <div>{t("start")}</div>
      </Button>
    </Wrapper>
  );
}
