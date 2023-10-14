import { Endpoint } from "payload/config";
import { PayloadRequest } from "payload/types";

export type CollectionEndpoint = Omit<Endpoint, "root">;

export type EndpointAccess<U> = (req: PayloadRequest<U>) => boolean;
