class RedisControl {
  constructor(log, connections, pid) {
    this.log = log;
    this.connections = connections;
    this.pid = pid;
  }

  listen() {
    try {
      this.connections.forEach((element) => {
        element.subClient.addListener('message', /* istanbul ignore next */(channel, message) => {
          this.log.debug('yellow', `Broker PID: ${this.pid} - REDIS Channel ${channel} :${message}`);
        });

        element.subClient.on('ready', /* istanbul ignore next */() => {
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

      return true;
    } catch (error) {
      return false;
    }
  }
}
module.exports = RedisControl;
