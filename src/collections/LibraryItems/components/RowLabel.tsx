import React from "react";
import styled from "styled-components";
import { isDefined } from "../../../utils/asserts";

interface Props {
  page?: number;
  image?: string;
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

export const RowLabel = ({ page, image }: Props): JSX.Element => (
  <Container>
    {isDefined(page) && <div className="pill pill--style-white">{`Page ${page}`}</div>}
    {isDefined(image) && <Title>{image}</Title>}
  </Container>
);
