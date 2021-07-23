import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { AppLoader } from "../components/Loader";
import { Twemoji } from "../components/Twemoji";
import useRandomGPromise from "../hooks/useRandomGPromise";
import {
  Angel,
  Blockquote,
  Button,
  Figcaption,
  Tagline,
  Wrapper,
} from "./styles";

export default function Home() {
  const { t: tHome } = useTranslation("home");
  const { t: tError } = useTranslation("error");
  const randomGPromiseQuery = useRandomGPromise();

  return (
    <Wrapper>
      <Angel>
        <Twemoji emoji="👼" height={"4rem"} />
      </Angel>
      <Tagline>
        <Blockquote>{tHome("intro")}</Blockquote>
        <Figcaption>{tHome("author")}</Figcaption>
      </Tagline>
      {randomGPromiseQuery.isLoading || randomGPromiseQuery.isIdle ? (
        <AppLoader />
      ) : randomGPromiseQuery.isError ? (
        tError("generic error")
      ) : (
        <Link href={`/p/${randomGPromiseQuery.data.id}`} passHref>
          <Button>
            <div>{tHome("start")}</div>
          </Button>
        </Link>
      )}
    </Wrapper>
  );
}
