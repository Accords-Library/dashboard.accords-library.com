import React from "react";
import { isDefined } from "../../utils/asserts";
import { formatLanguageCode, shortenEllipsis } from "../../utils/string";
import { Language } from "../../types/collections";

interface Props {
  language?: Language | string;
  title?: string;
}

export const RowLabel = ({ language, title }: Props): JSX.Element => {
  return (
    <div style={{ display: "flex", placeItems: "center", gap: 10 }}>
      {isDefined(language) && typeof language === "string" && (
        <div className="pill pill--style-white">{formatLanguageCode(language)}</div>
      )}
      {isDefined(title) && (
        <div style={{ fontWeight: 600, fontSize: "1.2rem" }}>{shortenEllipsis(title, 50)}</div>
      )}
    </div>
  );
};
