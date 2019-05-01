/* eslint-disable */
const Redis = require('ioredis');
const assert = require('assert');

const Log = require('./log.js');
const Colors = require('./colors.js');
const DateTime = require('./date-time.js');

const dateTime = new DateTime();
const log = new Log(dateTime, Colors);

function assertBrokerOptions(brokerOptions) {
  assert(brokerOptions, '"brokerOptions" is required to create a Redis client with sc-redis');
  assert(brokerOptions.host, '"brokerOptions.host" is required to create a Redis client with sc-redis');
  assert(brokerOptions.port, '"brokerOptions.port" is required to create a Redis client with sc-redis');
}

function throwMissingRedisClientError(clientName) {
  throw new Error('Missing "' + clientName + '" option. Both "pubClient" and "subClient" must be specified if passing your own clients.');
}

module.exports.attach = function (broker) {

  const instanceId = broker.instanceId;
  var subClient = null;
  var pubClient = null;

  if (!subClient && !pubClient) {
    const brokerOptions = broker.options.brokerOptions;
    assertBrokerOptions(brokerOptions);

    try {
      subClient = new Redis({
        host: brokerOptions.host,
        port: brokerOptions.port,
        autoResubscribe: false,
        retryStrategy: () => 5000,
      });
      pubClient = new Redis({
        host: brokerOptions.host,
        port: brokerOptions.port,
        autoResubscribe: false,
        retryStrategy: () => 5000,
      });
    } catch (error) {
    }
  } else if (!subClient && pubClient) {
    throwMissingRedisClientError("subClient");
  } else if (subClient && !pubClient) {
    throwMissingRedisClientError("pubClient");
  }

  subClient.on('ready', () => {
    log.debug('green', `Broker PID: ${process.pid} - REDIS Connected at ${subClient.options.host} :${subClient.options.port}`);
  });

  subClient.on('reconnecting', () => {
    log.debug('red', `Broker PID: ${process.pid} - REDIS Lost Connection with ${subClient.options.host} :${subClient.options.port} retrying in 5 seconds`);
  });

  subClient.on('error', () => {
  });

  pubClient.on('error', () => {
  });

  broker.on('subscribe', subClient.subscribe.bind(subClient));

  broker.on('unsubscribe', subClient.unsubscribe.bind(subClient));

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

    pubClient.publish(channel, data);
  });

  var instanceIdRegex = /^[^\/]*\//;

  subClient.on('message', (channel, message) => {
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
};