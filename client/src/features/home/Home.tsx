import React from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import styled, { keyframes } from "styled-components/macro";
import { useAppDispatch } from "../../app/hooks";
import useRandomGPromise from "../../hooks/useRandomGPromise";
import { setCurrentGPromise } from "../gPromises/gPromisesSlice";
import Twemoji from "../twemoji/Twemoji";
import PulseLoader from "react-spinners/PulseLoader";

const color = "hsl(205, 87%, 76%)";
const lightColor = "hsl(205, 87%, 96%)";

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
  background-color: ${lightColor};
  border: 2px solid currentColor;
  color: ${color};
  padding: 0.5em 1em;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
`;

const Angel = styled.div`
  background-color: transparent;
  margin: 2rem 0 4rem;
  img {
    filter: drop-shadow(0px 12px 24px rgba(0, 0, 0, 0.5));
    animation: ${rotate} 6s ease-in-out infinite;
  }
`;

export default function Home() {
  const { t } = useTranslation();
  const { isLoading, isError, data: randomGPromise } = useRandomGPromise();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const getAPromise = () => {
    queryClient.refetchQueries("randomGPromise");
    if (randomGPromise) {
      dispatch(setCurrentGPromise(randomGPromise));
    }
  };

  if (isError) {
    return <div>Something wrong happened fetching a random promise!</div>;
  }

  return (
    <Wrapper>
      <Angel>
        <Twemoji emoji="👼" height={"4rem"} />
      </Angel>
      {isLoading ? (
        <PulseLoader speedMultiplier={0.5} color={lightColor} />
      ) : (
        <Button onClick={getAPromise} title={t("start")}>
          <div>{t("Get a promise!")}</div>
        </Button>
      )}
    </Wrapper>
  );
}
