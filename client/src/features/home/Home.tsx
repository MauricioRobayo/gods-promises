import React from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import styled, { keyframes } from "styled-components/macro";
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

const Button = styled.button`
  background-color: transparent;
  border: none;
`;

const Angel = styled.div`
  background-color: transparent;
  margin: 2rem;
  img {
    filter: drop-shadow(0px 12px 25px rgba(0, 0, 0, 0.5));
    animation: ${rotate} 6s ease-in-out infinite;
  }
`;

export default function Home() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return (
    <Button
      type="button"
      onClick={() => queryClient.invalidateQueries("randomGPromise")}
      title={t("start")}
    >
      <Angel>
        <Twemoji emoji="😇" height={"4rem"} />
      </Angel>
      <div>
        <Twemoji emoji="▶" /> {t("start")}
      </div>
    </Button>
  );
}
