import Redis from "redis";

const DEFAULT_EXPIRATION = 3600 * 6; // 6 hours
const CACHE_OPERATION_TIMEOUT = 5000;
export let redisAvailable = false;

export const redisClient = Redis.createClient({
  url: "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.log(
          "Redis connection failed after multiple attempts. Running without Redis."
        );
        return false;
      }
      return Math.min(retries * 100, 3000);
    },
  },
});

export const initRedis = async () => {
  try {
    await redisClient.connect();
    redisAvailable = true;
    console.log("Redis client connected");
  } catch (error) {
    console.error("Redis connection error:", error);
    console.log("Application will continue without Redis caching");
  }

  redisClient.on("error", (err) => {
    console.error("Redis error:", err);
    redisAvailable = false;
  });
};

export const getOrSetCache = async (key, cb, useCache = true) => {
  if (!redisAvailable || !useCache) {
    return await cb();
  }

  try {
    const data = await redisClient.get(key);
    if (data) {
      return JSON.parse(data);
    }
    const freshData = await cb();
    if (freshData) {
      await redisClient.setEx(
        key,
        DEFAULT_EXPIRATION,
        JSON.stringify(freshData)
      );
      return freshData;
    }
  } catch (error) {
    console.error("Redis cache error:", error);
    return cb();
  }
};

/**
 * Clear cache with timeout wrapper - safe for local development
 * Won't throw errors if Redis is unavailable
 */
export const clearCache = async (key) => {
  if (!redisAvailable) {
    console.log(`⚠️ Redis unavailable, skipping cache clear for: ${key}`);
    return;
  }

  try {
    await Promise.race([
      redisClient.del(key),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Cache clear timeout")),
          CACHE_OPERATION_TIMEOUT
        )
      ),
    ]);
    console.log(`✅ Cache cleared: ${key}`);
  } catch (error) {
    console.error(
      `⚠️ Cache clear failed for ${key} (continuing anyway):`,
      error.message
    );
  }
};

export const clearCacheByPattern = async (pattern) => {
  if (!redisAvailable) {
    console.log(
      `⚠️ Redis unavailable, skipping pattern cache clear: ${pattern}`
    );
    return;
  }

  try {
    await Promise.race([
      (async () => {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
          const pipeline = redisClient.multi();
          for (const key of keys) {
            pipeline.del(key);
          }
          await pipeline.exec();
          console.log(
            `✅ Cleared ${keys.length} caches matching pattern: ${pattern}`
          );
        }
      })(),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Cache pattern clear timeout")),
          CACHE_OPERATION_TIMEOUT
        )
      ),
    ]);
  } catch (error) {
    console.error(
      `⚠️ Cache pattern clear failed for ${pattern} (continuing anyway):`,
      error.message
    );
  }
};
