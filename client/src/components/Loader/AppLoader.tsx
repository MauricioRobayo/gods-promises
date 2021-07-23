import React from "react";
import { PulseLoader } from "react-spinners";
import styled from "styled-components";
import { lightTheme } from "../../styles/theme";

const Wrapper = styled.div``;

type LoaderProps = {
  size?: number;
  className?: string;
};
function Loader({ size = 15, className = "" }: LoaderProps) {
  return (
    <Wrapper className={className}>
      <PulseLoader
        size={size}
        speedMultiplier={0.5}
        color={lightTheme.color.brand}
      />
    </Wrapper>
  );
}

export default Loader;
