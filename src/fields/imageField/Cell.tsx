import { Props } from "payload/components/views/Cell";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { styled } from "styled-components";
import { isUndefined } from "../../utils/asserts";

const Image = styled.img`
  height: 3rem;
  width: 3rem;
  object-fit: contain;
  transition: 0.2s transform;
  transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  position: absolute;
  transform: translateY(-50%) scale(1);
  &:hover {
    transform: translateY(-50%) scale(3);
  }
`;

export const Cell = ({ cellData, field, rowData, collection }: Props): JSX.Element => {
  const [imageURL, setImageURL] = useState<string>();
  useEffect(() => {
    const fetchUrl = async () => {
      if (isUndefined(cellData)) return;
      if (typeof cellData !== "string") return;
      if (field.type !== "upload") return;
      const result = await (await fetch(`/api/${field.relationTo}/${cellData}`)).json();
      setImageURL(result.sizes.thumb.url);
    };
    fetchUrl();
  }, [cellData]);
  const link = useMemo(
    () => `/admin/collections/${collection.slug}/${rowData.id}`,
    [collection.slug, rowData.id]
  );

  return <Link to={link}>{imageURL ? <Image src={imageURL} /> : "<No Image>"}</Link>;
};
