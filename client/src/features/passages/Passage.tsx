import React from "react";
import { useQueryClient } from "react-query";
import styled from "styled-components";
import ContentLoader from "../loaders/ContentLoader";
import Twemoji from "../twemoji/Twemoji";

const Figure = styled.figure`
  margin: 0;
  background-color: #f0f0f0;
  font-family: "Quattrocento", serif;
  border-radius: 0.5rem;
  padding: 1.25em;
  width: clamp(320px, 90vw, 520px);
`;

const Blockquote = styled.blockquote`
  color: #000;
  line-height: 1.25em;
  font-size: 1.25rem;
`;

const Figcaption = styled.figcaption`
  margin-top: 1em;
  text-align: right;
  &::before {
    content: "—";
    margin-right: 0.25em;
  }
`;

const Footer = styled.footer`
  font-size: 0.85rem;
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  a {
    text-decoration: none;
  }
`;

const Button = styled.button`
  background-color: transparent;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25em;
  cursor: pointer;
`;

const ButtonsWrapper = styled.div`
  & > button:not(:last-child) {
    margin-right: 1rem;
  }
`;

type PassageProps = {
  promise: {
    text: string;
    reference: string;
    source: string;
  };
  isLoading: boolean;
};

const Passage = ({ promise, isLoading }: PassageProps) => {
  const queryClient = useQueryClient();
  const onRefreshButtonClick = () => {
    queryClient.resetQueries("randomPromise");
  };
  return (
    <article>
      <Figure>
        {isLoading ? (
          <ContentLoader />
        ) : (
          <>
            <Blockquote dangerouslySetInnerHTML={{ __html: promise.text }} />
            <Figcaption>{promise.reference}</Figcaption>
          </>
        )}
      </Figure>
      <Footer>
        <ButtonsWrapper>
          <Button onClick={onRefreshButtonClick}>
            <Twemoji emoji="🔃" /> refresh
          </Button>
        </ButtonsWrapper>
      </Footer>
    </article>
  );
};

export default Passage;
