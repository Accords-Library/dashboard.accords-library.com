import React from "react";
import { Language } from "../../types/collections";
import { isDefined } from "../../utils/asserts";
import { formatLanguageCode } from "../../utils/string";

interface Props {
  cellData: { language?: string | Language; title?: string }[];
}

export const Cell = ({ cellData }: Props): JSX.Element => (
  <div style={{ display: "flex", gap: "6px" }}>
    {cellData.map(({ language, title }, index) => (
      <div key={index} className="pill">
        <abbr title={title} style={{ textDecorationColor: "var(--color-base-500)" }}>
          <div style={{ position: "relative" }}>
            {isDefined(language) && typeof language === "string"
              ? formatLanguageCode(language)
              : index}
          </div>
        </abbr>
      </div>
    ))}
  </div>
);
