class RedisControl {
  constructor(log, connections, pid, broker) {
    this.log = log;
    this.connections = connections;
    this.pid = pid;
    this.broker = broker;
  }

  bindSubscribe(connections) {
    this.log.debug('yellow', `Broker PID: ${this.pid} - REDIS Binding subscribe`);
    return connections[0].subClient.subscribe.bind(connections[0].subClient);
  }

  bindUnsubscribe(connections) {
    this.log.debug('yellow', `Broker PID: ${this.pid} - REDIS Binding unsubscribe`);
    return connections[0].subClient.unsubscribe.bind(connections[0].subClient);
  }

  listen() {
    const instanceIdRegex = /^[^\\/]*\//;
    try {
      this.connections.forEach((element, key) => {
        element.subClient.addListener('message', /* istanbul ignore next */(channel, message) => {
          this.log.debug('yellow', `Broker PID: ${this.pid} - REDIS Channel ${channel} :${message}`);
        });

        element.subClient.on('ready', /* istanbul ignore next */() => {
          this.actualServer = key;
          this.log.debug('green', `Broker PID: ${this.pid} - REDIS Connected at ${element.subClient.options.host} :${element.subClient.options.port}`);
        });

        element.subClient.on('reconnecting', /* istanbul ignore next */() => {
          this.log.debug('red', `Broker PID: ${this.pid} - REDIS Lost Connection with ${element.subClient.options.host} :${element.subClient.options.port} retrying in 5 seconds`);
        });

        element.subClient.on('error', /* istanbul ignore next */() => {
        });

        element.pubClient.on('error', /* istanbul ignore next */() => {
        });
      });

      this.broker.on('subscribe', this.bindSubscribe(this.connections));
      this.broker.on('unsubscribe', this.bindUnsubscribe(this.connections));

      this.connections[0].subClient.on('message', (channel, message) => {
        let sender = null;
        const newMessage = message.replace(instanceIdRegex, (match) => {
          sender = match.slice(0, -1);
          return '';
        });

        if (sender == null || sender !== this.instanceId) {
          this.broker.publish(channel, newMessage);
        }
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}
module.exports = RedisControl;
