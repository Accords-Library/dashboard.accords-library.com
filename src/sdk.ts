import { Collections } from "./constants";
import { WeaponsThumbnail } from "./types/collections";

class NodeCache {
  constructor(_params: any) {}
  getTtl(_key: string): number | undefined {
    return undefined;
  }
  get<T>(_key: string): T | undefined {
    return undefined;
  }
  set<T>(_key: string, _value: T, _ttl: number | string) {}
}

// END MOCKING SECTION

const REFRESH_FREQUENCY_IN_SEC = 60;
const CACHE = new NodeCache({
  checkperiod: REFRESH_FREQUENCY_IN_SEC,
  deleteOnExpire: true,
  forceString: true,
  maxKeys: 1,
});
const TOKEN_KEY = "token";

type PayloadLoginResponse = {
  token: string;
  exp: number;
};

const refreshToken = async () => {
  const loginUrl = payloadApiUrl(Collections.Recorders, "login");
  const loginResult = await fetch(loginUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.PAYLOAD_USER,
      password: process.env.PAYLOAD_PASSWORD,
    }),
  });
  logResponse(loginResult);

  if (loginResult.status !== 200) {
    throw new Error("Unable to login");
  }

  const loginJson = (await loginResult.json()) as PayloadLoginResponse;
  const { token, exp } = loginJson;
  const now = Math.floor(Date.now() / 1000);
  const ttl = Math.floor(exp - now - REFRESH_FREQUENCY_IN_SEC * 2);
  const ttlInMinutes = Math.floor(ttl / 60);
  console.log("Token was refreshed. TTL is", ttlInMinutes, "minutes.");
  CACHE.set(TOKEN_KEY, token, ttl);
  return token;
};

const getToken = async (): Promise<string> => {
  const cachedToken = CACHE.get<string>(TOKEN_KEY);
  if (cachedToken !== undefined) {
    const cachedTokenTtl = CACHE.getTtl(TOKEN_KEY) as number;
    const diffInMinutes = Math.floor((cachedTokenTtl - Date.now()) / 1000 / 60);
    console.log("Retrieved token from cache. TTL is", diffInMinutes, "minutes.");
    return cachedToken;
  }
  console.log("Refreshing token");
  return await refreshToken();
};

const injectAuth = async (init?: RequestInit): Promise<RequestInit> => ({
  ...init,
  headers: { ...init?.headers, Authorization: `JWT ${await getToken()}` },
});

const logResponse = (res: Response) => console.log(res.status, res.statusText, res.url);

const payloadApiUrl = (collection: Collections, endpoint?: string): string =>
  `${process.env.PAYLOAD_API_URL}/${collection}${endpoint === undefined ? "" : `/${endpoint}`}`;

const request = async (url: string, init?: RequestInit): Promise<Response> => {
  const result = await fetch(url, await injectAuth(init));
  logResponse(result);

  if (result.status !== 200) {
    throw new Error("Unhandled fetch error");
  }

  return result;
};

// SDK and Types

export type EndpointWeapon = EndpointBasicWeapon & {
  appearances: {
    categories: string[];
    translations: {
      language: string;
      sourceLanguage: string;
      name: string;
      description?: string;
      level1?: string;
      level2?: string;
      level3?: string;
      level4?: string;
      transcribers: string[];
      translators: string[];
      proofreaders: string[];
    }[];
  }[];
  group?: {
    slug: string;
    translations: { language: string; name: string }[];
    weapons: EndpointBasicWeapon[];
  };
};

export type EndpointBasicWeapon = {
  slug: string;
  type: string;
  categories: string[];
  translations: { language: string; name: string; aliases: string[] }[];
  thumbnail?: WeaponsThumbnail;
};

export const payload = {
  getSlugsWeapons: async (): Promise<string[]> =>
    await (await request(payloadApiUrl(Collections.Weapons, "slugs"))).json(),
  getWeapon: async (slug: string): Promise<EndpointWeapon> =>
    await (await request(payloadApiUrl(Collections.Weapons, `slug/${slug}`))).json(),
};
