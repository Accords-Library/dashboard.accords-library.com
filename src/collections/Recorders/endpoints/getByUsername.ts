import { Collections } from "../../../constants";
import { createGetByEndpoint } from "../../../endpoints/createGetByEndpoint";
import { EndpointRecorder } from "../../../sdk";
import { Recorder } from "../../../types/collections";
import { isPayloadType, isValidPayloadImage } from "../../../utils/asserts";

export const getByUsernameEndpoint = createGetByEndpoint({
  collection: Collections.Recorders,
  attribute: "username",
  handler: (recorder) => convertRecorderToEndpointRecorder(recorder),
});

export const convertRecorderToEndpointRecorder = ({
  id,
  languages,
  username,
  avatar,
  anonymize,
}: Recorder): EndpointRecorder => ({
  id,
  languages: languages?.map((language) => (isPayloadType(language) ? language.id : language)) ?? [],
  username: anonymize ? `Recorder#${id.substring(0, 5)}` : username,
  ...(isValidPayloadImage(avatar) ? { avatar } : {}),
});
