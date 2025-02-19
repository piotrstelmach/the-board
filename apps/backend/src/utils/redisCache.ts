import { redisClient } from './redisClient';

export function mapRedisHash<T>(
  data: { [key: string]: string },
  transformers: Partial<{ [K in keyof T]: (value: string) => any }> = {}
): T {
  const result: any = {};

  for (const key in data) {
    if (transformers[key as keyof T]) {
      result[key] = transformers[key as keyof T]?.(data[key]);
    } else {
      result[key] = data[key];
    }
  }

  return result as T;
}

export function saveToRedisHash<T extends Record<string, any>>(
  data: T
): { [p: string]: string } {
  const entries = Object.entries(data).reduce<{ [key: string]: string }>(
    (acc, [k, v]) => {
      acc[k] = typeof v === 'string' ? v : JSON.stringify(v);
      return acc;
    },
    {}
  );

  return entries;
}

export const invalidatePaginatedCache = async (cacheName: string) => {
  const keys = await redisClient.keys(`${cacheName}:*`);
  await redisClient.del(keys);
};
