class BrokerControl {
  constructor(log, scBroker, pid) {
    this.log = log;
    this.scBroker = scBroker;
    this.pid = pid;
  }

  listen() {
    try {
      this.scBroker.on('publish', /* istanbul ignore next */(channel, message) => {
        this.log.debug('yellow', `Broker PID: ${this.pid} - REDIS Channel ${channel} :${message} from client`);
      });

      this.scBroker.on('subscribe', /* istanbul ignore next */(channel) => {
        this.log.debug('yellow', `Broker PID: ${this.pid} - Subscribe channel ${channel}`);
      });

      this.scBroker.on('unsubscribe', /* istanbul ignore next */(channel) => {
        this.log.debug('yellow', `Broker PID: ${this.pid} - Unsubscribe channel ${channel}`);
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}
module.exports = BrokerControl;
