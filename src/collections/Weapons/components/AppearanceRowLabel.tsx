import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { Collections } from "../../../constants";

interface Props {
  keyIds: string[];
}

const Container = styled.div`
  display: flex;
  place-items: center;
  gap: 5px;
`;

export const AppearanceRowLabel = ({ keyIds }: Props): JSX.Element => {
  const [keySlugs, setKeySlugs] = useState<string[]>([]);
  useEffect(() => {
    const fetchUrl = async () => {
      const results = await Promise.all(
        keyIds.map(async (keyId) => await (await fetch(`/api/${Collections.Keys}/${keyId}`)).json())
      );
      setKeySlugs(results.map((result) => result.name));
    };
    fetchUrl();
  }, [keyIds]);

  return (
    <Container>
      {keySlugs.map((keySlug) => (
        <div id={keySlug} className="pill pill--style-white">
          {keySlug}
        </div>
      ))}
    </Container>
  );
};
