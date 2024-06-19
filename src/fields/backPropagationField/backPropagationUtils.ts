import payload, { GeneratedTypes } from "payload";
import { SanitizedCollectionConfig, SanitizedGlobalConfig } from "payload/types";

export const getAddedBackPropagationRelationships = async (
  config: SanitizedCollectionConfig | SanitizedGlobalConfig,
  doc: any,
  previousDoc?: any
): Promise<string[]> => {
  if (!("getBackPropagatedRelationships" in config.custom)) {
    return [];
  }

  const getBackPropagatedRelationships: (doc: any) => string[] =
    config.custom.getBackPropagatedRelationships;

  if (!previousDoc) {
    return getBackPropagatedRelationships(doc);
  }

  let currentIds: string[];
  let previousIds: string[];

  if (config.versions.drafts) {
    const versions = await payload.findVersions({
      collection: config.slug as keyof GeneratedTypes["collections"],
      sort: "-updatedAt",
      limit: 2,
      where: {
        and: [{ parent: { equals: doc.id } }, { "version._status": { equals: "published" } }],
      },
    });

    const currentVersion = versions.docs[0]?.version;
    const previousVersion = versions.docs[1]?.version;

    if (!currentVersion) return [];
    if (!previousVersion) return getBackPropagatedRelationships(currentVersion);

    currentIds = getBackPropagatedRelationships(currentVersion);
    previousIds = getBackPropagatedRelationships(previousVersion);
  } else {
    currentIds = getBackPropagatedRelationships(doc);
    previousIds = getBackPropagatedRelationships(previousDoc);
  }

  return currentIds.filter((id) => !previousIds.includes(id));
};
