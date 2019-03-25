/* eslint-disable */
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const { expect } = chai;
chai.use(dirtyChai);

const Log = require('../app/log.js');

const date = new Date();
const DateTime = require('../app/date-time.js');
const Colors = require('../app/colors.js');
const dateTime = new DateTime(date);

describe('Log', () => {

  describe('constructor', () => {

    it('should instanciate the class', () => {
      const log = new Log(
        dateTime,
        Colors,
      );
      expect(typeof log).to.equal('object');
      expect(typeof log.debug).to.equal('function');
    });

  });

  describe('debug', () => {
      
    it('should debug and return true', () => {
      const log = new Log(
        dateTime,
        Colors,
      );
      const result = log.debug('green', 'test');
      expect(typeof result).to.equal('boolean');
      expect(result).to.true();
    });
  });
  
});
