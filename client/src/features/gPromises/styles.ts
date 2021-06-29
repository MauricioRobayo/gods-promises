import { FaForward, FaShareAlt } from "react-icons/fa";
import styled, { css } from "styled-components/macro";

export const cssTransitionClassNamesPrefix = "passage-";
export const cssTransitionTimeout = 300;

export const Article = styled.article`
  width: 90vw;
  max-width: ${({ theme }) => theme.size.medium};
  &.${cssTransitionClassNamesPrefix}-exit {
    opacity: 0;
    transform: translateX(-500px);
    transition: opacity ${cssTransitionTimeout}ms ease-in,
      transform ${cssTransitionTimeout}ms ease-in;
  }
  &.${cssTransitionClassNamesPrefix}-enter {
    opacity: 0;
    transform: translateX(500px);
  }
  &.${cssTransitionClassNamesPrefix}-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: opacity ${cssTransitionTimeout}ms ease-out,
      transform ${cssTransitionTimeout}ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }
`;

export const Header = styled.div`
  margin: 0 ${({ theme }) => theme.space.side.small} 1rem;
  @media (min-width: ${({ theme }) => theme.size.small}) {
    margin: 0 ${({ theme }) => theme.space.side.medium} 1rem;
  }
  @media (min-width: ${({ theme }) => theme.size.medium}) {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
`;

export const Title = styled.h2`
  font-family: ${({ theme }) => theme.font.family.secondary};
  font-size: ${({ theme }) => theme.font.size.large};
  font-style: italic;
`;

export const Subtitle = styled.div`
  color: ${({ theme }) => theme.color.text2};
  font-size: ${({ theme }) => theme.font.size.small};
`;

export const BlockquoteWrapper = styled.section`
  margin: 0;
  background-color: ${({ theme }) => theme.color.surface3};
  font-family: ${({ theme }) => theme.font.family.secondary};
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px 0 ${({ theme }) => theme.color.surfaceShadow2};
  padding: ${({ theme }) => theme.space.side.small};
  @media (min-width: ${({ theme }) => theme.size.small}) {
    padding: ${({ theme }) => theme.space.side.medium};
  }
`;

export const Blockquote = styled.blockquote`
  color: ${({ theme }) => theme.color.text1};
  line-height: 1.5em;
  font-size: 1.25rem;
  &::before,
  &::after {
    opacity: 0.5;
    font-size: 1.15em;
  }
  &::before {
    content: "“";
    margin-right: 0.05em;
  }
  &::after {
    content: "”";
    margin-left: 0.05em;
  }
`;

export const Footer = styled.footer`
  font-size: ${({ theme }) => theme.font.size.small};
  margin: 1em ${({ theme }) => theme.space.side.small} 0;
  @media (min-width: ${({ theme }) => theme.size.small}) {
    margin: 1rem ${({ theme }) => theme.space.side.medium} 0;
  }
  display: flex;
  justify-content: flex-end;
  a {
    text-decoration: none;
  }
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  & > * {
    &:not(:last-child) {
      margin-right: 1em;
    }
    & > *:not(:last-child) {
      margin-right: 0.5em;
    }
  }
`;

export const ShareButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.color.brand};
  cursor: pointer;
`;

const iconStyle = css`
  color: ${({ theme }) => theme.color.brand};
  margin-left: 0.5em;
`;

export const ShareIcon = styled(FaShareAlt)`
  ${iconStyle}
`;

export const ForwardIcon = styled(FaForward)`
  ${iconStyle}
`;
