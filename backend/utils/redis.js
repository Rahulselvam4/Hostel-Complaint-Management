import Redis from 'ioredis';

// Connect to Redis (defaults to localhost:6379)
const redis = new Redis();

export default redis;
