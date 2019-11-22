let redisCluster = [];

if (process.env.KAIROS_REDIS_URL) {
  redisCluster = process.env.KAIROS_REDIS_URL.trim().split(',').reduce((redisConfigs, redis) => {
    const [host, port] = redis.split(':');
    redisConfigs.push({ host, port: Number(port) });
    return redisConfigs;
  }, []);
}

module.exports = redisCluster;
