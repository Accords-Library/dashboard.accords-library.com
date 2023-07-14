import { Props } from "payload/components/views/Cell";
import { useState, useEffect } from "react";
import React from "react";

export const ImageCell: React.FC<Props> = ({ cellData, field }) => {
  const [imageURL, setImageURL] = useState<string>();
  useEffect(() => {
    const fetchUrl = async () => {
      if (typeof cellData !== "string") return;
      if (field.type !== "upload") return;
      const result = await (
        await fetch(`/api/${field.relationTo}/${cellData}`)
      ).json();
      setImageURL(result.url);
    };
    fetchUrl();
  }, [cellData]);

  return imageURL ? (
    <img
      style={{ height: "3rem", borderRadius: "100%", aspectRatio: "1/1" }}
      src={imageURL}
    />
  ) : (
    "<No image>"
  );
};
