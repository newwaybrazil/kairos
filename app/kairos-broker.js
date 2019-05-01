const Redis = require('ioredis');

const Log = require('./log.js');
const Colors = require('./colors.js');
const DateTime = require('./date-time.js');
const Config = require('../config/config.js');
const RedisConnections = require('./redis-connections');
const RedisControl = require('./redis-control');

const dateTime = new DateTime();
const log = new Log(dateTime, Colors);

module.exports.attach = (broker) => {
  const redisConnections = new RedisConnections(Config, Redis);
  const connections = redisConnections.connect();

  const redisControl = new RedisControl(log, connections, process.pid, broker);
  redisControl.listen();
};
