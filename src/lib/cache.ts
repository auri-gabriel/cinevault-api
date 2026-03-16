import { createClient } from 'redis';

type CacheClient = ReturnType<typeof createClient>;

let cacheClient: CacheClient | null = null;

const isCacheEnabled = (): boolean => process.env.CACHE_ENABLED !== 'false';

const getValkeyUrl = (): string =>
  process.env.VALKEY_URL || 'redis://localhost:6379';

const getDefaultTtlSeconds = (): number => {
  const ttlFromEnv = Number(process.env.CACHE_TTL_SECONDS || 60);
  return Number.isFinite(ttlFromEnv) && ttlFromEnv > 0 ? ttlFromEnv : 60;
};

const getCacheClient = (): CacheClient => {
  if (cacheClient) {
    return cacheClient;
  }

  cacheClient = createClient({ url: getValkeyUrl() });
  cacheClient.on('error', (error) => {
    console.error('[cache] Valkey connection error:', error);
  });

  return cacheClient;
};

export const initCache = async (): Promise<void> => {
  if (!isCacheEnabled()) {
    return;
  }

  const client = getCacheClient();
  if (client.isOpen) {
    return;
  }

  try {
    await client.connect();
    console.log('[cache] Connected to Valkey');
  } catch (error) {
    console.warn(
      '[cache] Valkey unavailable. Continuing without cache.',
      error,
    );
  }
};

const canUseCache = (): boolean =>
  isCacheEnabled() && cacheClient !== null && cacheClient.isOpen;

export const getFromCache = async <T>(key: string): Promise<T | null> => {
  if (!canUseCache()) {
    return null;
  }

  const client = getCacheClient();

  try {
    const value = await client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch (error) {
    console.warn(`[cache] Failed to get key "${key}"`, error);
    return null;
  }
};

export const setInCache = async <T>(
  key: string,
  value: T,
  ttlSeconds = getDefaultTtlSeconds(),
): Promise<void> => {
  if (!canUseCache()) {
    return;
  }

  const client = getCacheClient();

  try {
    await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (error) {
    console.warn(`[cache] Failed to set key "${key}"`, error);
  }
};

export const deleteCacheKeys = async (keys: string[]): Promise<void> => {
  if (!canUseCache() || keys.length === 0) {
    return;
  }

  const client = getCacheClient();

  try {
    await client.del(keys);
  } catch (error) {
    console.warn('[cache] Failed to delete cache keys', error);
  }
};
