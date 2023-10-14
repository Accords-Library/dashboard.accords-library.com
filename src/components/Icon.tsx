import styled from "styled-components";

export const Icon = styled.div`
  width: 18px;
  height: 18px;
  mask: url("/public/accords.svg");
  background-color: var(--theme-elevation-1000);
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask: url("/public/accords.svg");
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
`;
