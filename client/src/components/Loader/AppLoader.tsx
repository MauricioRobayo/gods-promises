import React from "react";
import { PulseLoader } from "react-spinners";
import styled from "styled-components";
import usePreferredColorScheme from "../../../../client-old/src/hooks/usePreferredColorScheme";
import { theme } from "../../../../client-old/src/styles";

const Wrapper = styled.div``;

type LoaderProps = {
  size?: number;
  className?: string;
};
function Loader({ size = 15, className = "" }: LoaderProps) {
  const preferredColorScheme = usePreferredColorScheme();
  return (
    <Wrapper className={className}>
      <PulseLoader
        size={size}
        speedMultiplier={0.5}
        color={theme[preferredColorScheme].color.brand}
      />
    </Wrapper>
  );
}

export default Loader;
