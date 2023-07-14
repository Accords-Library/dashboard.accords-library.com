import { RecorderBiographies } from "../../../types/collections";
import { AdminComponent } from "../../../utils/components";
import { isDefined } from "../../../utils/asserts";
import { formatLanguageCode, shortenEllipsis } from "../../../utils/string";

export const BiographiesRowLabel: AdminComponent<
  RecorderBiographies[number]
> = ({ data: { language, biography }, index }) => {
  const labelValues = [];
  if (isDefined(language) && typeof language === "string") {
    labelValues.push(formatLanguageCode(language));
  }
  if (isDefined(biography)) {
    labelValues.push(shortenEllipsis(biography, 50));
  }
  const label = labelValues.join(" — ");
  if (label === "") return `Biography ${index}`;
  return label;
};
