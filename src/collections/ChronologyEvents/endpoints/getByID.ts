import payload from "payload";
import { eventToEndpointEvent } from "./getAllEndpoint";
import { Collections } from "src/shared/payload/constants";
import { CollectionEndpoint } from "src/types/payload";

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

      return res.status(200).json(eventToEndpointEvent(result));
    } catch {
      return res.sendStatus(404);
    }
  },
};
