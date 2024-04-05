import { Endpoint } from "payload/config";

export type CollectionEndpoint = Omit<Endpoint, "root">;
