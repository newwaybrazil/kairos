/* eslint-disable */
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const simple = require('simple-mock');
const { expect } = chai;
chai.use(dirtyChai);

const WorkerControl = require('../app/worker-control.js');

const logSpy = simple.spy(() => {});
const scServerSpy = simple.spy(() => {});
const pid = 1234;

describe('WorkerControl', () => {

  describe('constructor', () => {
    it('should instanciate the class', () => {
      const workerControl = new WorkerControl(
        logSpy,
        scServerSpy,
        pid
      );
      expect(typeof workerControl).to.equal('object');
      expect(typeof workerControl.listen).to.equal('function');
    });
  });

  describe('listen', () => {

    it('should listen and return true', () => {
      const scServer2 = new Object();
      simple.mock(scServer2, 'on');
      scServer2.on.returnWith(true);
      const workerControl2 = new WorkerControl(
        logSpy,
        scServer2,
        pid
      );
      result = workerControl2.listen();
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(true);
    });

    it('should not listen and return false', () => {
      const scServer3 = new Object();
      simple.mock(scServer3, 'on');
      scServer3.on.throwWith(new Error());
      const workerControl3 = new WorkerControl(
        logSpy,
        scServer3,
        pid
      );
      result = workerControl3.listen((isValid) => {
        assert.equal(isValid, true);
        done();
      });
      expect(typeof result).to.equal('boolean');
      expect(result).to.equal(false);
    });

  });

});

