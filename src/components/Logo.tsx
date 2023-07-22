import React from "react";
import "@fontsource/vollkorn/700.css";
import { styled } from "styled-components";

export const Logo = (): JSX.Element => (
  <Container>
    <Icon />
    <Title>Accord’s Library</Title>
    <Subtitle>Dashboard</Subtitle>
  </Container>
);

const Container = styled.div`
  display: grid;
  place-items: center;
`;

const Title = styled.h1`
  font-family: "Vollkorn";
  margin-top: 2rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.h2`
  font-family: "Vollkorn";
  margin: 0;
`;

const Icon = styled.div`
  width: 256px;
  height: 256px;
  mask: url("/public/accords.svg");
  background-color: var(--theme-elevation-1000);
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
`;
