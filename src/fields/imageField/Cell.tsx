import { Props } from "payload/components/views/Cell";
import { useState, useEffect } from "react";
import React from "react";
import { isUndefined } from "../../utils/asserts";

export const Cell = ({ cellData, field }: Props): JSX.Element => {
  const [imageURL, setImageURL] = useState<string>();
  useEffect(() => {
    const fetchUrl = async () => {
      if (isUndefined(cellData)) return;
      if (typeof cellData !== "string") return;
      if (field.type !== "upload") return;
      const result = await (await fetch(`/api/${field.relationTo}/${cellData}`)).json();
      setImageURL(result.url);
    };
    fetchUrl();
  }, [cellData]);

  return (
    <>
      {imageURL ? (
        <img style={{ height: "3rem", borderRadius: "100%", aspectRatio: "1/1" }} src={imageURL} />
      ) : (
        "<No Image>"
      )}
    </>
  );
};
