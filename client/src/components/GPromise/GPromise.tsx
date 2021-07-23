import React, { ReactNode } from "react";
import {
  Article,
  Header,
  Title,
  Subtitle,
  BlockquoteWrapper,
  Blockquote,
  Footer,
  ButtonsWrapper,
} from "./styles";

type GPromiseProps = {
  title: string;
  subtitle: string;
  text: string;
  buttons: ReactNode[];
};
export default function GPromise({
  title,
  subtitle,
  text,
  buttons,
}: GPromiseProps) {
  return (
    <Article>
      <Header>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
      </Header>
      <BlockquoteWrapper>
        <Blockquote>{text}</Blockquote>
      </BlockquoteWrapper>
      <Footer>
        <ButtonsWrapper>
          {buttons.map((button, index) => (
            <React.Fragment key={index}>{button}</React.Fragment>
          ))}
        </ButtonsWrapper>
      </Footer>
    </Article>
  );
}
