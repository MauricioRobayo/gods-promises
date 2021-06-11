import React from "react";
import { useTranslation } from "react-i18next";
import styled, { keyframes } from "styled-components/macro";
import useRandomGPromise from "../../hooks/useRandomGPromise";
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
  background-color: hsl(205, 87%, 95%);
  border: 2px solid hsl(205, 87%, 75%);
  padding: 0.5em 1em;
  border-radius: 8px;
  cursor: pointer;
  color: #444;
`;

const Angel = styled.div`
  background-color: transparent;
  margin: 2rem 0;
  img {
    filter: drop-shadow(0px 12px 24px rgba(0, 0, 0, 0.5));
    animation: ${rotate} 6s ease-in-out infinite;
  }
`;

export default function Home() {
  const { t } = useTranslation();
  useRandomGPromise();

  const getAPromise = () => {
    alert("this should move to the first promise");
  };

  return (
    <Wrapper>
      <Angel>
        <Twemoji emoji="👼" height={"4rem"} />
      </Angel>
      <Button onClick={getAPromise} title={t("start")}>
        <div>{t("Get a promise!")}</div>
      </Button>
    </Wrapper>
  );
}
