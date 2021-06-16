import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled, { keyframes } from "styled-components/macro";
import { PROMISE_PATH } from "../../config";
import useRandomGPromise from "../../hooks/useRandomGPromise";
import { AppLoader } from "../loaders";
import Twemoji from "../twemoji/Twemoji";

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
  margin: 0 0 3rem;
  img {
    filter: drop-shadow(
      0px 12px 24px ${({ theme }) => theme.color.surfaceShadow1}
    );
    animation: ${rotate} 6s ease-in-out infinite;
  }
`;

const Tagline = styled.figure`
  text-align: center;
  margin: 0 0 2rem;
  padding: 0;
  max-width: ${({ theme }) => theme.size.small};
  width: 100%;
`;

const Blockquote = styled.blockquote`
  font-size: 1.25rem;
  line-height: 1.5em;
  font-family: ${({ theme }) => theme.font.family.secondary};
  &::before,
  &::after {
    opacity: 0.5;
    font-size: 1.15em;
  }
  &::before {
    content: "“";
    margin-right: 0.05em;
  }
  &::after {
    content: "”";
    margin-left: 0.05em;
  }
`;

const Figcaption = styled.figcaption`
  color: ${({ theme }) => theme.color.text2};
  margin-top: 1em;
  &::before,
  &::after {
    opacity: 0.5;
  }
  &::before {
    content: "~";
    margin-right: 0.25em;
  }
  &::after {
    content: "~";
    margin-left: 0.25em;
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
      <Angel>
        <Twemoji emoji="👼" height={"4rem"} />
      </Angel>
      <Tagline>
        <Blockquote>
          {t(
            "If you need wisdom, ask our generous God, and he will give it to you. He will not rebuke you for asking."
          )}
        </Blockquote>
        <Figcaption>{t("James 1.5")}</Figcaption>
      </Tagline>
      {isLoading ? (
        <AppLoader />
      ) : (
        <Button onClick={getAPromise} title={t("start")}>
          <div>{t("Give me a promise!")}</div>
        </Button>
      )}
    </Wrapper>
  );
}
