import { BeforeDuplicate } from "payload/types";
import { Recorder } from "../../../types/collections";

export const beforeDuplicate: BeforeDuplicate<Recorder> = ({ data }) => {
  return {
    ...data,
    id: `${data.id}-copy`,
  };
};
