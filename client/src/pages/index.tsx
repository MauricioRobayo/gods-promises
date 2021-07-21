// import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";

function Home() {
  // const { t } = useTranslation();
  const { locale } = useRouter();
  return <h1>{locale}</h1>;
}

export default Home;
