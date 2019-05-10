/* eslint-disable */
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const simple = require('simple-mock');
const { expect } = chai;
chai.use(dirtyChai);

const BrokerControl = require('../app/broker-control.js');

const logSpy = simple.spy(() => {});
const scBrokerSpy = simple.spy(() => {});
const pid = 1234;

describe('BrokerControl', () => {

  describe('constructor', () => {
    it('should instanciate the class', () => {
      const brokerControl = new BrokerControl(
        logSpy,
        scBrokerSpy,
        pid
      );
      expect(typeof brokerControl).to.equal('object');
      expect(typeof brokerControl.listen).to.equal('function');
    });
  });

  describe('listen', () => {

    it('should listen and return true', () => {
      const scBroker2 = new Object();
      simple.mock(scBroker2, 'on');
      scBroker2.on.returnWith(true);
      const brokerControl2 = new BrokerControl(
        logSpy,
        scBroker2,
        pid
      );
      result = brokerControl2.listen();
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(true);
    });

    it('should not listen and return false', () => {
      const scBroker3 = new Object();
      simple.mock(scBroker3, 'on');
      scBroker3.on.throwWith(new Error());
      const brokerControl3 = new BrokerControl(
        logSpy,
        scBroker3,
        pid
      );
      result = brokerControl3.listen((isValid) => {
        assert.equal(isValid, true);
        done();
      });
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(false);
    });

  });

});

