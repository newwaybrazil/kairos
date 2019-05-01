/* eslint-disable */
const Redis = require('ioredis');

const Log = require('./log.js');
const Colors = require('./colors.js');
const DateTime = require('./date-time.js');
const Config = require('../config/config.js');
const RedisConnections = require('./redis-connections');
const RedisControl = require('./redis-control');

const dateTime = new DateTime();
const log = new Log(dateTime, Colors);

module.exports.attach = function (broker) {

  function bindSubscribe(connections) {
    log.debug('yellow', `Broker PID: ${process.pid} - REDIS Binding subscribe`);
    return connections[0].subClient.subscribe.bind(connections[0].subClient);
  }

  function bindUnsubscribe(connections) {
    log.debug('yellow', `Broker PID: ${process.pid} - REDIS Binding unsubscribe`);
    return connections[0].subClient.unsubscribe.bind(connections[0].subClient);
  }

  const instanceId = broker.instanceId;

  const redisConnections = new RedisConnections(Config, Redis);
  const connections = redisConnections.connect();

  const redisControl = new RedisControl(log, connections, process.pid);
  redisControl.listen();

  broker.on('subscribe', bindSubscribe(connections));
  broker.on('unsubscribe', bindUnsubscribe(connections));

  broker.on('publish', (channel, data) => {
    if (data instanceof Object) {
      try {
        data = '/o:' + JSON.stringify(data);
      } catch (e) {
        data = '/s:' + data;
      }
    } else {
      data = '/s:' + data;
    }

    if (instanceId != null) {
      data = instanceId + data;
    }

    connections[0].pubClient.publish(channel, data);
  });

  var instanceIdRegex = /^[^\/]*\//;

  connections[0].subClient.on('message', (channel, message) => {
    var sender = null;
    message = message.replace(instanceIdRegex, function (match) {
      sender = match.slice(0, -1);
      return '';
    });

    if (sender == null || sender != instanceId) {
      var type = message.charAt(0);
      var data;
      if (type == 'o') {
        try {
          data = JSON.parse(message.slice(2));
        } catch (e) {
          data = message.slice(2);
        }
      } else {
        data = message.slice(2);
      }
      broker.publish(channel, data);
    }
  });
}