import useTranslation from "next-translate/useTranslation";
import { Twemoji } from "../components/Twemoji";
import useRandomGPromise from "../hooks/useRandomGPromise";
import { AppLoader } from "../components/Loader";
import Link from "next/link";
import {
  Button,
  Wrapper,
  Angel,
  Tagline,
  Blockquote,
  Figcaption,
} from "./styles";

export default function IndexPage() {
  const { t } = useTranslation("home");
  const { t: tError } = useTranslation("error");
  const randomGPromiseQuery = useRandomGPromise();

  return (
    <Wrapper>
      <Angel>
        <Twemoji emoji="👼" height={"4rem"} />
      </Angel>
      <Tagline>
        <Blockquote>{t("intro")}</Blockquote>
        <Figcaption>{t("author")}</Figcaption>
      </Tagline>
      {randomGPromiseQuery.isLoading || randomGPromiseQuery.isIdle ? (
        <AppLoader />
      ) : randomGPromiseQuery.isError ? (
        tError("generic error")
      ) : (
        <Link href={`/p/${randomGPromiseQuery.data.id}`} passHref>
          <Button>
            <div>{t("start")}</div>
          </Button>
        </Link>
      )}
    </Wrapper>
  );
}
