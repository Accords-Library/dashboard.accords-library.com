import { TagGroup } from "../sdk";
import { Tag } from "../types/collections";
import { isPayloadArrayType, isPayloadType } from "./asserts";

export const convertTagsToGroups = (tags: (string | Tag)[] | null | undefined): TagGroup[] => {
    if (!isPayloadArrayType(tags)) {
      return [];
    }
  
    const groups: TagGroup[] = [];
  
    tags.forEach(({ group, slug }) => {
      if (isPayloadType(group)) {
        const existingGroup = groups.find((existingGroup) => existingGroup.slug === group.slug);
        if (existingGroup) {
          existingGroup.values.push(slug);
        } else {
          groups.push({
            slug: group.slug,
            icon: group.icon ?? "material-symbols:category-outline",
            values: [slug],
          });
        }
      }
    });
  
    return groups;
  };
  