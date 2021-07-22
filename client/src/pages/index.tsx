import useTranslation from "next-translate/useTranslation";
import { Twemoji } from "../components/Twemoji";
import useRandomGPromise from "../hooks/useRandomGPromise";
import { AppLoader } from "../components/Loader";
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
  const { t: tError } = useTranslation("error");
  const { isLoading, isError, data } = useRandomGPromise();

  return (
    <Wrapper>
      <Angel>
        <Twemoji emoji="👼" height={"4rem"} />
      </Angel>
      <Tagline>
        <Blockquote>{t("intro")}</Blockquote>
        <Figcaption>{t("author")}</Figcaption>
      </Tagline>
      {isLoading ? (
        <AppLoader />
      ) : isError || Math.random() > 0 ? (
        tError("generic error")
      ) : (
        <Button title={t("start")}>
          <div>{t("start")}</div>
        </Button>
      )}
    </Wrapper>
  );
}
