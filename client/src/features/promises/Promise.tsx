import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  background-color: #f0f0f0;
  font-family: "Cormorant Garamond", serif;
  border-radius: 5px;
  padding: 1rem;
`;

type PromiseProps = {
  promise: {
    content: string;
    reference: string;
  };
};

const Promise = ({ promise }: PromiseProps) => {
  return (
    <Wrapper>
      <div dangerouslySetInnerHTML={{ __html: promise.content }} />
    </Wrapper>
  );
};

export default Promise;
