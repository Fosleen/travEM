import Redis from "redis";

const DEFAULT_EXPIRATION = 3600 * 6; // 6 hours
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

export const getOrSetCache = async (key, cb) => {
  if (!redisAvailable) {
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

export const clearCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error("Redis clear cache error:", error);
  }
};
