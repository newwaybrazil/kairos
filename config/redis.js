module.exports = {
  redisConnections: () => {
    const envValue = process.env.KAIROS_REDIS_URL || [];
    let arrayValue = [];
    if (envValue.length > 0) {
      arrayValue = envValue.split(', ') || [];
    }
    const response = [];
    arrayValue.forEach((element) => {
      const item = element.split(':');
      response.push({
        host: item[0],
        port: Number(item[1]),
      });
    });
    return response;
  },
};
