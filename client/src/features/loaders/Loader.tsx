import React from "react";
import { PulseLoader } from "react-spinners";
import styled from "styled-components";

const Wrapper = styled.div``;

type LoaderProps = {
  size?: number;
  className?: string;
};
export default function Loader({ size = 15, className = "" }: LoaderProps) {
  return (
    <Wrapper className={className}>
      <PulseLoader
        size={size}
        speedMultiplier={0.5}
        color="hsl(205, 87%, 96%)"
      />
    </Wrapper>
  );
}
