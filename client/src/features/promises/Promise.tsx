import React from "react";
import styled from "styled-components";
import ContentLoader from "../loaders/ContentLoader";

const Figure = styled.figure`
  margin: 0;
  background-color: #f0f0f0;
  font-family: "Cormorant Garamond", serif;
  border-radius: 0.5rem;
  padding: 1.25em;
  width: clamp(320px, 90vw, 520px);
`;

const Blockquote = styled.blockquote`
  color: #000;
  line-height: 1.25em;
`;

const Figcaption = styled.figcaption`
  margin-top: 1em;
  text-align: right;
  font-style: italic;
  &::before {
    content: "—";
    margin-right: 0.25em;
  }
`;

type PromiseProps = {
  promise: {
    text: string;
    reference: string;
    source: string;
  };
  isLoading: boolean;
};

const Promise = ({ promise, isLoading }: PromiseProps) => {
  return (
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
  );
};

export default Promise;
