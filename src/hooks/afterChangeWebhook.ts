import { AfterChangeHook } from "payload/dist/globals/config/types";
import { Collections, WebHookMessage, WebHookOperationType } from "../constants";

export const afterChangeWebhook: AfterChangeHook = async ({ doc, global }) => {
  const url = `${process.env.WEB_HOOK_URI}/collection-operation`;

  const message: WebHookMessage = {
    collection: global.slug as Collections,
    operation: WebHookOperationType.update,
  };

  fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.WEB_HOOK_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
    method: "POST",
  }).catch((e) => {
    console.warn("Error while sending webhook", url, e);
  });

  return doc;
};
