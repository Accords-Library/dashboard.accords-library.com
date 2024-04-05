import { AfterChangeHook } from "payload/dist/globals/config/types";

export const afterChangeWebhook: AfterChangeHook = async ({ doc, global }) => {
  const url = `${process.env.WEB_HOOK_URI}/collection-operation`;
  await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.WEB_HOOK_TOKEN}`,
      Collection: global.slug,
    },
  });
  return doc;
};
