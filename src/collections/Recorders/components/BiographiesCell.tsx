import { Props } from "payload/components/views/Cell";
import { useMemo } from "react";
import React from "react";
import { RecorderBiographies } from "../../../types/collections";
import { isDefined } from "../../../utils/asserts";
import { formatLanguageCode } from "../../../utils/string";

export const BiographiesCell: React.FC<Props> = ({ cellData }) => {
  if (!Array.isArray(cellData)) return <>No biographies</>;

  return (
    <div style={{ display: "flex", gap: "6px" }}>
      {cellData.map((biography: RecorderBiographies[number], index) => (
        <BiographyCell key={biography.id} {...biography} index={index} />
      ))}
    </div>
  );
};

const BiographyCell: React.FC<
  RecorderBiographies[number] & { index: number }
> = ({ language, biography, index }) => {
  const label = useMemo(() => {
    if (isDefined(language) && typeof language === "string") {
      return formatLanguageCode(language);
    }
    return `Biography ${index}`;
  }, []);

  return (
    <div
      className="biography-cell"
      style={{
        backgroundColor: "var(--theme-elevation-100)",
        color: "var(--theme-elevation-800)",
        padding: "0.2em 0.5em",
        borderRadius: 3,
      }}
    >
      <abbr title={biography}>
        <div style={{ position: "relative" }}>{label}</div>
      </abbr>
    </div>
  );
};
