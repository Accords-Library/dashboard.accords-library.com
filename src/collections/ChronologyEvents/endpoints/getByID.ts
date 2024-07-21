import payload from "payload";
import { CollectionEndpoint } from "../../../types/payload";
import { convertEventToEndpointEvent } from "./getAllEndpoint";
import { Collections } from "../../../shared/payload/constants";

export const getByID: CollectionEndpoint = {
  method: "get",
  path: "/id/:id",
  handler: async (req, res) => {
    if (!req.user) {
      return res.status(403).send({
        errors: [
          {
            message: "You are not allowed to perform this action.",
          },
        ],
      });
    }

    if (!req.params.id) {
      return res.status(400).send({ errors: [{ message: "Missing 'id' query params" }] });
    }

    try {
      const result = await payload.findByID({
        collection: Collections.ChronologyEvents,
        id: req.params.id,
      });

      return res.status(200).json(convertEventToEndpointEvent(result));
    } catch {
      return res.sendStatus(404);
    }
  },
};
