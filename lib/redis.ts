import { createClient } from "redis";

const redisClient = createClient({
  username: process.env.NEXT_PUBLIC_REDIS_USERNAME,
  password: process.env.NEXT_REDIS_PASSWORD,
  socket: {
    host: process.env.NEXT_PUBLIC_REDIS_HOST!,
    port: Number(process.env.NEXT_PUBLIC_REDIS_PORT),
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

export { redisClient, connectRedis };
