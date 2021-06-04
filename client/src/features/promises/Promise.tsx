import React from "react";
import styled from "styled-components";

const Wrapper = styled.figure`
  margin: 0;
  background-color: #f0f0f0;
  font-family: "Cormorant Garamond", serif;
  border-radius: 0.5rem;
  padding: 1.25em;
`;

const Blockquote = styled.blockquote`
  color: #000;
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
};

const Promise = ({ promise }: PromiseProps) => {
  return (
    <Wrapper>
      <Blockquote dangerouslySetInnerHTML={{ __html: promise.text }} />
      <Figcaption>{promise.reference}</Figcaption>
    </Wrapper>
  );
};

export default Promise;
