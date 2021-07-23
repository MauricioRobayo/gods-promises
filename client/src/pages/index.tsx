import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { AppLoader } from "../components/Loader";
import { Twemoji } from "../components/Twemoji";
import useRandomGPromise from "../hooks/useRandomGPromise";
import styled, { keyframes } from "styled-components";

const float = keyframes`
  0% {
		transform: translateY(0px);
	}
	40% {
		transform: translateY(-12px);
	}
	80% {
		transform: translateY(0px);
	}`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Button = styled.a`
  background-color: transparent;
  border: 2px solid currentColor;
  color: ${({ theme }) => theme.color.brand};
  padding: 0.5em 1em;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
`;

export const Angel = styled.div`
  background-color: transparent;
  margin-top: 48px; /* the top margin is important, it includes the shadow and the translate y offset */
  margin-bottom: 3rem;
  position: relative;
  z-index: 1;
  img {
    filter: drop-shadow(
      0px 12px 24px ${({ theme }) => theme.color.surfaceShadow1}
    );
    animation: ${float} 6s ease-in-out infinite;
  }
`;

export const Tagline = styled.figure`
  text-align: center;
  margin: 0 0 2rem;
  padding: 0;
  max-width: ${({ theme }) => theme.size.small};
  width: 100%;
`;

export const Blockquote = styled.blockquote`
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

export const Figcaption = styled.figcaption`
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
