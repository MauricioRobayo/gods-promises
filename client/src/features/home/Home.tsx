import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled, { keyframes } from "styled-components/macro";
import { PROMISE_PATH } from "../../config";
import useRandomGPromise from "../../hooks/useRandomGPromise";
import { AppLoader } from "../loaders";
import Twemoji from "../twemoji/Twemoji";
import { Helmet } from "react-helmet";

const rotate = keyframes`
  0% {
		transform: translatey(0px);
	}
	40% {
		transform: translatey(-12px);
	}
	80% {
		transform: translatey(0px);
	}`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.button.attrs({
  type: "button",
})`
  background-color: transparent;
  border: 2px solid currentColor;
  color: ${({ theme }) => theme.color.brand};
  padding: 0.5em 1em;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
`;

const Angel = styled.div`
  background-color: transparent;
  margin: 2rem 0 3rem;
  img {
    filter: drop-shadow(
      0px 12px 24px ${({ theme }) => theme.color.surfaceShadow1}
    );
    animation: ${rotate} 6s ease-in-out infinite;
  }
`;

export default function Home() {
  const { t, i18n } = useTranslation();
  const { isLoading, isError, data: randomGPromise } = useRandomGPromise();
  const { push } = useHistory();

  const getAPromise = () => {
    if (!randomGPromise) {
      return;
    }

    push(`/${i18n.language}/${PROMISE_PATH}/${randomGPromise.id}`);
  };

  if (isError) {
    return <div>Something wrong happened fetching a random promise!</div>;
  }

  return (
    <Wrapper>
      <Helmet>
        <title>{t("God's Promises")}</title>
        <meta
          name="description"
          content={t(
            "If you need wisdom, ask our generous God, and he will give it to you. He will not rebuke you for asking."
          )}
        />
      </Helmet>
      <Angel>
        <Twemoji emoji="👼" height={"4rem"} />
      </Angel>
      {isLoading ? (
        <AppLoader />
      ) : (
        <Button onClick={getAPromise} title={t("start")}>
          <div>{t("Get a promise!")}</div>
        </Button>
      )}
    </Wrapper>
  );
}
