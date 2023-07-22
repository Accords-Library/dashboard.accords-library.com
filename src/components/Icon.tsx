import React from "react";
import { styled } from "styled-components";

export const Icon = styled.div`
  width: 46px;
  height: 46px;
  mask: url("/public/accords.svg");
  background-color: var(--theme-elevation-1000);
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
`;
