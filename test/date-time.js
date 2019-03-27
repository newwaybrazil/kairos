/* eslint-disable */
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const { expect } = chai;
chai.use(dirtyChai);

const DateTime = require('../app/date-time.js');

describe('DateTime', () => {

  describe('constructor', () => {
    it('should instanciate the class', () => {
      const dateTime = new DateTime();
      expect(typeof dateTime).to.equal('object');
      expect(typeof dateTime.getDate).to.equal('function');
    });
  });

  describe('alwaysTwoDigits', () => {

    it('should return a string with two digits when number is lower then 10', () => {
      const dateTime = new DateTime();
      const result = dateTime.alwaysTwoDigits(9);
      expect(typeof result).to.equal('string');
      expect(result.length).to.equal(2);
      expect(result).to.equal('09');
    });

    it('should return a string with same number when number is at least 10', () => {
      const dateTime = new DateTime();
      const result = dateTime.alwaysTwoDigits(10);
      expect(typeof result).to.equal('string');
      expect(result.length).to.equal(2);
      expect(result).to.equal('10');
    });

  });

  describe('getFullYear', () => {

    it('should return 4 digits year', () => {
      const dateTime = new DateTime();
      const result = dateTime.getFullYear();
      expect(typeof result).to.equal('number');
      expect(result).to.greaterThan(2018);
      expect(String(result).length).to.equal(4);
    });

  });

  describe('getMonth', () => {

    it('should return 2 digits month', () => {
      const dateTime = new DateTime();
      const result = dateTime.getMonth();
      expect(typeof result).to.equal('string');
      expect(parseInt(result)).to.greaterThan(0);
      expect(parseInt(result)).to.lessThan(13);
      expect(result.length).to.equal(2);
    });

  });

  describe('getDay', () => {

    it('should return 2 digits day', () => {
      const dateTime = new DateTime();
      const result = dateTime.getDay();
      expect(typeof result).to.equal('string');
      expect(parseInt(result)).to.greaterThan(0);
      expect(parseInt(result)).to.lessThan(32);
      expect(result.length).to.equal(2);
    });

  });

  describe('getHours', () => {

    it('should return 2 digits hour', () => {
      const dateTime = new DateTime();
      const result = dateTime.getHours();
      expect(typeof result).to.equal('string');
      expect(parseInt(result)).to.greaterThan(-1);
      expect(parseInt(result)).to.lessThan(25);
      expect(result.length).to.equal(2);
    });

  });

  describe('getMinutes', () => {

    it('should return 2 digits minute', () => {
      const dateTime = new DateTime();
      const result = dateTime.getMinutes();
      expect(typeof result).to.equal('string');
      expect(parseInt(result)).to.greaterThan(-1);
      expect(parseInt(result)).to.lessThan(60);
      expect(result.length).to.equal(2);
    });

  });

  describe('getSeconds', () => {

    it('should return 2 digits second', () => {
      const dateTime = new DateTime();
      const result = dateTime.getSeconds();
      expect(typeof result).to.equal('string');
      expect(parseInt(result)).to.greaterThan(-1);
      expect(parseInt(result)).to.lessThan(60);
      expect(result.length).to.equal(2);
    });

  });

  describe('getDate', () => {

    it('should return a date string', () => {
      const dateTime = new DateTime();
      const result = dateTime.getDate();
      expect(typeof result).to.equal('string');
      expect(result.length).to.equal(21);
    });
    
  });
  
});
