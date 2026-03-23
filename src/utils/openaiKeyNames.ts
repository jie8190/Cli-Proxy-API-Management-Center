const STORAGE_KEY_OPENAI_KEY_NAME_MAP = 'cli-proxy-openai-key-name-map';

export type OpenAIKeyNameMap = Record<string, string>;

const normalizeScopePart = (value: string) => String(value || '').trim().toLowerCase();

export const buildOpenAIKeyNameId = (providerName: string, baseUrl: string, apiKey: string) => {
  const normalizedApiKey = String(apiKey || '').trim();
  if (!normalizedApiKey) return '';
  const scope = `${normalizeScopePart(providerName)}||${normalizeScopePart(baseUrl)}`;
  return `${scope}||${normalizedApiKey}`;
};

export const readOpenAIKeyNameMap = (): OpenAIKeyNameMap => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_OPENAI_KEY_NAME_MAP);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.entries(parsed as Record<string, unknown>).reduce<OpenAIKeyNameMap>((acc, [key, value]) => {
      const normalizedKey = String(key || '').trim();
      const normalizedValue = String(value || '').trim();
      if (!normalizedKey || !normalizedValue) return acc;
      acc[normalizedKey] = normalizedValue;
      return acc;
    }, {});
  } catch {
    return {};
  }
};

export const writeOpenAIKeyNameMap = (map: OpenAIKeyNameMap) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY_OPENAI_KEY_NAME_MAP, JSON.stringify(map));
  } catch {
    // Ignore storage failures silently.
  }
};

export const resolveOpenAIKeyName = (
  map: OpenAIKeyNameMap,
  providerName: string,
  baseUrl: string,
  apiKey: string
) => {
  const id = buildOpenAIKeyNameId(providerName, baseUrl, apiKey);
  if (!id) return '';
  return map[id] ?? '';
};

