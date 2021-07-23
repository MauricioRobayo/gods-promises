import { FaForward, FaShareAlt, FaTwitter } from "react-icons/fa";
import styled, { css } from "styled-components";

export const ShareButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.color.brand};
  cursor: pointer;
`;

const iconStyle = css``;

export const TwitterIcon = styled(FaTwitter)`
  ${iconStyle}
`;

export const ShareIcon = styled(FaShareAlt)`
  ${iconStyle}
`;

export const ForwardIcon = styled(FaForward)`
  ${iconStyle}
`;
