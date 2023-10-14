import React from "react";
import styled from "styled-components";
import { Language } from "../../types/collections";
import { isDefined } from "../../utils/asserts";
import { formatLanguageCode, shortenEllipsis } from "../../utils/string";

interface Props {
  language?: Language | string;
  title?: string;
}

const Container = styled.div`
  display: flex;
  place-items: center;
  gap: 10px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 1.2rem;
`;

export const RowLabel = ({ language, title }: Props): JSX.Element => (
  <Container>
    {isDefined(language) && typeof language === "string" && (
      <div className="pill pill--style-white">{formatLanguageCode(language)}</div>
    )}
    {isDefined(title) && <Title>{shortenEllipsis(title, 50)}</Title>}
  </Container>
);
