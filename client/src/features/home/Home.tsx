import React from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import styled, { keyframes } from "styled-components/macro";
import { useAppDispatch } from "../../app/hooks";
import useRandomGPromise from "../../hooks/useRandomGPromise";
import { setCurrentGPromise } from "../gPromises/gPromisesSlice";
import Loader from "../loaders/Loader";
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
  background-color: ${({ theme }) => theme.color.surface3};
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
        <Loader />
      ) : (
        <Button onClick={getAPromise} title={t("start")}>
          <div>{t("Get a promise!")}</div>
        </Button>
      )}
    </Wrapper>
  );
}
