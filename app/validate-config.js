class ValidateConfig {
  constructor(log) {
    this.log = log;
  }

  validate(config) {
    this.isNull(config);
    this.notArray(config);
    this.isEmpty(config);

    let element = 0;
    for (element; element < config.length; element += 1) {
      this.elementNotObject(config, element);
      this.elementMissingHost(config, element);
      this.elementMissingPort(config, element);
      this.elementHostNotString(config, element);
      this.elementPortNotNumber(config, element);
      this.elementHostEmpty(config, element);
      this.elementPortEmpty(config, element);
    }
    return true;
  }

  isNull(config) {
    if (config == null) {
      this.log.debug('red', 'Config is null');
      this.throwConfigError();
    }
    return false;
  }

  notArray(config) {
    if (!Array.isArray(config)) {
      this.log.debug('red', 'Config must be an array');
      this.throwConfigError();
    }
    return false;
  }

  isEmpty(config) {
    if (config.length < 1) {
      this.log.debug('red', 'Config must have at least one object');
      this.throwConfigError();
    }
    return false;
  }

  elementNotObject(config, element) {
    if (typeof config[element] !== 'object') {
      this.log.debug('red', 'Config element must be an object');
      this.throwConfigError();
    }
    return false;
  }

  elementMissingHost(config, element) {
    if (typeof (config[element].host) === 'undefined') {
      this.log.debug('red', 'Config element must has a host property');
      this.throwConfigError();
    }
    return false;
  }

  elementMissingPort(config, element) {
    if (typeof (config[element].port) === 'undefined') {
      this.log.debug('red', 'Config element must has a port property');
      this.throwConfigError();
    }
    return false;
  }

  elementHostNotString(config, element) {
    if (typeof (config[element].host) !== 'string') {
      this.log.debug('red', 'Config element host property must be a string');
      this.throwConfigError();
    }
    return false;
  }

  elementPortNotNumber(config, element) {
    if (typeof (config[element].port) !== 'number') {
      this.log.debug('red', 'Config element port property must be a number');
      this.throwConfigError();
    }
    return false;
  }

  elementHostEmpty(config, element) {
    if (config[element].host === '') {
      this.log.debug('red', 'Config element host property must not be empty');
      this.throwConfigError();
    }
    return false;
  }

  elementPortEmpty(config, element) {
    if (config[element].port < 1) {
      this.log.debug('red', 'Config element port property must be grater than 0');
      this.throwConfigError();
    }
    return false;
  }

  throwConfigError() {
    const message = 'Error on load config see the file ./config/redis.js';
    throw new Error(message);
  }
}
module.exports = ValidateConfig;
