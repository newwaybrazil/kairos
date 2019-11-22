const Redis = require('ioredis');

const Log = require('./app/log.js');
const Colors = require('./app/colors.js');
const DateTime = require('./app/date-time.js');
const config = require('./config/redis.js');
const RedisConnections = require('./app/redis-connections');
const RedisControl = require('./app/redis-control');

const dateTime = new DateTime();
const log = new Log(dateTime, Colors);

module.exports.attach = (broker) => {
  const redisConnections = new RedisConnections(config, Redis);
  const connections = redisConnections.connect();

  const redisControl = new RedisControl(log, connections, process.pid, broker);
  redisControl.listen();
};
