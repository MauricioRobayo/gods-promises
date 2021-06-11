import React from "react";
import { PulseLoader } from "react-spinners";
import styled from "styled-components";

const Wrapper = styled.div``;

type LoaderProps = {
  className?: string;
};
export default function Loader({ className = "" }: LoaderProps) {
  return (
    <Wrapper className={className}>
      <PulseLoader speedMultiplier={0.5} color="hsl(205, 87%, 96%)" />
    </Wrapper>
  );
}
