import React, { memo } from "react";
import styled from "styled-components/macro";

type TwemojiProps = {
  emoji: string;
  height?: string;
  width?: string;
  className?: string;
};

const Wrapper = styled.span`
  line-height: 0;
`;

const StyledImg = styled.img<Pick<TwemojiProps, "height" | "width">>`
  display: inline-block;
  height: ${({ height }) => height};
  width: ${({ width }) => width};
`;

const Twemoji = ({
  emoji,
  className = "",
  height = "1em",
  width = "auto",
}: TwemojiProps) => {
  const emojiCode = emoji.codePointAt(0)?.toString(16);
  return (
    <Wrapper>
      <StyledImg
        className={className}
        src={`https://twemoji.maxcdn.com/v/latest/svg/${emojiCode}.svg`}
        alt={emoji}
        height={height}
        width={width}
      />
    </Wrapper>
  );
};

export default memo(Twemoji);
