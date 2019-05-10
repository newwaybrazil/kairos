class RedisConnections {
  constructor(config, redis) {
    this.config = config;
    this.Redis = redis;
  }

  connect() {
    try {
      const connections = [];
      this.config.forEach((element) => {
        const pubConn = new this.Redis({
          host: element.host,
          port: element.port,
          autoResubscribe: false,
          maxRetriesPerRequest: null,
          retryStrategy: /* istanbul ignore next */() => 5000,
        });
        const subConn = new this.Redis({
          host: element.host,
          port: element.port,
          autoResubscribe: false,
          maxRetriesPerRequest: null,
          retryStrategy: /* istanbul ignore next */() => 5000,
        });
        const conn = {
          pubClient: pubConn,
          subClient: subConn,
        };
        connections.push(conn);
      });
      return connections;
    } catch (error) {
      return [];
    }
  }
}
module.exports = RedisConnections;
