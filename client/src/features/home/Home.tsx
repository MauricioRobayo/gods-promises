import React from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
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

const Button = styled.button.attrs({
  type: "button",
})`
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const Angel = styled.div`
  background-color: transparent;
  margin: 2rem;
  img {
    filter: drop-shadow(0px 12px 24px rgba(0, 0, 0, 0.5));
    animation: ${rotate} 6s ease-in-out infinite;
  }
`;

export default function Home() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  useRandomGPromise();

  return (
    <Button
      onClick={() => queryClient.invalidateQueries("randomGPromise")}
      title={t("start")}
    >
      <Angel>
        <Twemoji emoji="👼" height={"4rem"} />
      </Angel>
      <div>{t("Get a promise!")}</div>
    </Button>
  );
}
