import { AfterOperationHook } from "payload/dist/collections/config/types";
import { Collections, WebHookMessage, WebHookOperationType } from "../constants";

const convertOperationToWebHookOperationType = (
  operation: string
): WebHookOperationType | undefined => {
  switch (operation) {
    case "create":
      return WebHookOperationType.create;

    case "update":
    case "updateByID":
      return WebHookOperationType.update;

    case "delete":
    case "deleteByID":
      return WebHookOperationType.delete;

    default:
      return undefined;
  }
};

export const afterOperationWebhook: AfterOperationHook = ({ result, collection, operation }) => {
  const operationType = convertOperationToWebHookOperationType(operation);
  if (!operationType) return result;

  if (operationType === WebHookOperationType.update) {
    if ("_status" in result && result._status === "draft") {
      return result;
    }
  }

  if (!("id" in result)) {
    return result;
  }

  const message: WebHookMessage = {
    collection: collection.slug as Collections,
    operation: operationType,
    id: result.id,
  };

  const url = `${process.env.WEB_HOOK_URI}/collection-operation`;

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

  return result;
};
