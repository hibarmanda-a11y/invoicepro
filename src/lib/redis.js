import { Redis } from "ioredis";

const globalForRedis = global;

const redis =
  globalForRedis._redis ||
  (globalForRedis._redis = new Redis(process.env.REDIS_URL));

export default redis;