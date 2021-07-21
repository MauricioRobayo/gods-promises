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
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Angel>
        <Twemoji emoji="👼" height={"4rem"} />
      </Angel>
      <Tagline>
        <Blockquote>{t("home:intro")}</Blockquote>
        <Figcaption>{t("home:author")} 1.5</Figcaption>
      </Tagline>
      <Button title={t("home:start")}>
        <div>{t("home:start")}</div>
      </Button>
    </Wrapper>
  );
}
