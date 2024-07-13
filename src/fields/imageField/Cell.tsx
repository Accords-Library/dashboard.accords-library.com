import { Props } from "payload/components/views/Cell";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { isUndefined } from "src/utils/asserts";

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

  return (
    <Link to={link}>
      {imageURL ? (
        <img className="thumbnail thumbnail--size-small file__thumbnail" src={imageURL} />
      ) : (
        "<No Image>"
      )}
    </Link>
  );
};
