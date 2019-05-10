/* eslint-disable */
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const simple = require('simple-mock');
const { expect } = chai;
chai.use(dirtyChai);

const ValidateConfig = require('../app/validate-config.js');

describe('ValidateConfig', () => {

  describe('constructor', () => {
    it('should instanciate the class', () => {
      const validateConfig = new ValidateConfig();
      expect(typeof validateConfig).to.equal('object');
      expect(typeof validateConfig.validate).to.equal('function');
    });
  });

  describe('isNull', () => {

    it('should return false if config is not null', () => {
      const config = 'some';
      const validateConfig = new ValidateConfig();
      const result = validateConfig.isNull(config);
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(false);
    });

    it('should throw an error if config is null', () => {
      const config = null;
      const Log = new Object();
      simple.mock(Log, 'debug');
      Log.debug.returnWith(true);
      const validateConfig = new ValidateConfig(Log);
      chai.assert.throw(
        function () {
          validateConfig.isNull(config)
        },
        Error,
        "Error on load config see the file ./config/redis.js"
      );
    });

  });


  describe('notArray', () => {

    it('should return false if config is an array', () => {
      const config = [];
      const validateConfig = new ValidateConfig();
      const result = validateConfig.notArray(config);
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(false);
    });

    it('should throw an error if config is not an array', () => {
      const config = null;
      const Log = new Object();
      simple.mock(Log, 'debug');
      Log.debug.returnWith(true);
      const validateConfig = new ValidateConfig(Log);
      chai.assert.throw(
        function () {
          validateConfig.notArray(config)
        },
        Error,
        "Error on load config see the file ./config/redis.js"
      );
    });

  });

  describe('isEmpty', () => {

    it('should return false if config is not empty', () => {
      const config = [1];
      const validateConfig = new ValidateConfig();
      const result = validateConfig.isEmpty(config);
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(false);
    });

    it('should throw an error if config is empty', () => {
      const config = [];
      const Log = new Object();
      simple.mock(Log, 'debug');
      Log.debug.returnWith(true);
      const validateConfig = new ValidateConfig(Log);
      chai.assert.throw(
        function () {
          validateConfig.isEmpty(config)
        },
        Error,
        "Error on load config see the file ./config/redis.js"
      );
    });

  });

  describe('elementNotObject', () => {

    it('should return false if config element is an object', () => {
      const config = [
        {
          prop: 1,
        },
      ];
      const validateConfig = new ValidateConfig();
      const result = validateConfig.elementNotObject(config, 0);
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(false);
    });

    it('should throw an error if config is empty', () => {
      const config = [1];
      const Log = new Object();
      simple.mock(Log, 'debug');
      Log.debug.returnWith(true);
      const validateConfig = new ValidateConfig(Log);
      chai.assert.throw(
        function () {
          validateConfig.elementNotObject(config, 0)
        },
        Error,
        "Error on load config see the file ./config/redis.js"
      );
    });

  });

  describe('elementMissingHost', () => {

    it('should return false if config element has host property', () => {
      const config = [
        {
          host: 1,
        },
      ];
      const validateConfig = new ValidateConfig();
      const result = validateConfig.elementMissingHost(config, 0);
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(false);
    });

    it('should throw an error if config is empty', () => {
      const config = [
        {
          prop: 1,
        },
      ];
      const Log = new Object();
      simple.mock(Log, 'debug');
      Log.debug.returnWith(true);
      const validateConfig = new ValidateConfig(Log);
      chai.assert.throw(
        function () {
          validateConfig.elementMissingHost(config, 0)
        },
        Error,
        "Error on load config see the file ./config/redis.js"
      );
    });

  });

  describe('elementMissingPort', () => {

    it('should return false if config element has host property', () => {
      const config = [
        {
          port: 1,
        },
      ];
      const validateConfig = new ValidateConfig();
      const result = validateConfig.elementMissingPort(config, 0);
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(false);
    });

    it('should throw an error if config is empty', () => {
      const config = [
        {
          prop: 1,
        },
      ];
      const Log = new Object();
      simple.mock(Log, 'debug');
      Log.debug.returnWith(true);
      const validateConfig = new ValidateConfig(Log);
      chai.assert.throw(
        function () {
          validateConfig.elementMissingPort(config, 0)
        },
        Error,
        "Error on load config see the file ./config/redis.js"
      );
    });

  });

  describe('elementHostNotString', () => {

    it('should return false if config element has host property', () => {
      const config = [
        {
          host: 'string',
        },
      ];
      const validateConfig = new ValidateConfig();
      const result = validateConfig.elementHostNotString(config, 0);
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(false);
    });

    it('should throw an error if config is empty', () => {
      const config = [
        {
          host: 1,
        },
      ];
      const Log = new Object();
      simple.mock(Log, 'debug');
      Log.debug.returnWith(true);
      const validateConfig = new ValidateConfig(Log);
      chai.assert.throw(
        function () {
          validateConfig.elementHostNotString(config, 0)
        },
        Error,
        "Error on load config see the file ./config/redis.js"
      );
    });

  });

  describe('elementPortNotNumber', () => {

    it('should return false if config element has host property', () => {
      const config = [
        {
          port: 1,
        },
      ];
      const validateConfig = new ValidateConfig();
      const result = validateConfig.elementPortNotNumber(config, 0);
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(false);
    });

    it('should throw an error if config is empty', () => {
      const config = [
        {
          port: 'string',
        },
      ];
      const Log = new Object();
      simple.mock(Log, 'debug');
      Log.debug.returnWith(true);
      const validateConfig = new ValidateConfig(Log);
      chai.assert.throw(
        function () {
          validateConfig.elementPortNotNumber(config, 0)
        },
        Error,
        "Error on load config see the file ./config/redis.js"
      );
    });

  });

  describe('elementHostEmpty', () => {

    it('should return false if config element has host property', () => {
      const config = [
        {
          host: 'string',
        },
      ];
      const validateConfig = new ValidateConfig();
      const result = validateConfig.elementHostEmpty(config, 0);
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(false);
    });

    it('should throw an error if config is empty', () => {
      const config = [
        {
          host: '',
        },
      ];
      const Log = new Object();
      simple.mock(Log, 'debug');
      Log.debug.returnWith(true);
      const validateConfig = new ValidateConfig(Log);
      chai.assert.throw(
        function () {
          validateConfig.elementHostEmpty(config, 0)
        },
        Error,
        "Error on load config see the file ./config/redis.js"
      );
    });

  });

  describe('elementHostEmpty', () => {

    it('should return false if config element has host property', () => {
      const config = [
        {
          host: 'string',
        },
      ];
      const validateConfig = new ValidateConfig();
      const result = validateConfig.elementHostEmpty(config, 0);
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(false);
    });

    it('should throw an error if config is empty', () => {
      const config = [
        {
          host: '',
        },
      ];
      const Log = new Object();
      simple.mock(Log, 'debug');
      Log.debug.returnWith(true);
      const validateConfig = new ValidateConfig(Log);
      chai.assert.throw(
        function () {
          validateConfig.elementHostEmpty(config, 0)
        },
        Error,
        "Error on load config see the file ./config/redis.js"
      );
    });

  });

  describe('elementPortEmpty', () => {

    it('should return false if config element has host property', () => {
      const config = [
        {
          port: 1,
        },
      ];
      const validateConfig = new ValidateConfig();
      const result = validateConfig.elementPortEmpty(config, 0);
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(false);
    });

    it('should throw an error if config is empty', () => {
      const config = [
        {
          port: 0,
        },
      ];
      const Log = new Object();
      simple.mock(Log, 'debug');
      Log.debug.returnWith(true);
      const validateConfig = new ValidateConfig(Log);
      chai.assert.throw(
        function () {
          validateConfig.elementPortEmpty(config, 0)
        },
        Error,
        "Error on load config see the file ./config/redis.js"
      );
    });

  });

  describe('validate', () => {

    it('should return true if config passes all valitations', () => {
      const config = [
        {
          host: 'localhost',
          port: 6379,
        },
        {
          host: 'localhost',
          port: 6380,
        },
      ];
      const validateConfig = new ValidateConfig();
      const result = validateConfig.validate(config);
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(true);
    });

  });

});
