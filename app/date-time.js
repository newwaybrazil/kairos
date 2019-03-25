class DateTime {
  constructor(date) {
    this.date = date;
  }

  // eslint-disable-next-line class-methods-use-this
  alwaysTwoDigits(number) {
    let result = number;
    if (result < 10) {
      result = `0${result}`;
    }
    return String(result);
  }

  getFullYear() {
    return this.date.getFullYear();
  }

  getMonth() {
    const month = this.date.getMonth() + 1;
    return this.alwaysTwoDigits(month);
  }

  getDay() {
    const day = this.date.getDate();
    return this.alwaysTwoDigits(day);
  }

  getHours() {
    const hours = this.date.getHours();
    return this.alwaysTwoDigits(hours);
  }

  getMinutes() {
    const mins = this.date.getMinutes();
    return this.alwaysTwoDigits(mins);
  }

  getSeconds() {
    const secs = this.date.getSeconds();
    return this.alwaysTwoDigits(secs);
  }

  getDate() {
    const year = this.getFullYear();
    const month = this.getMonth();
    const day = this.getDay();
    const hours = this.getHours();
    const mins = this.getMinutes();
    const secs = this.getSeconds();
    return `[${year}-${month}-${day} ${hours}:${mins}:${secs}]`;
  }
}
module.exports = DateTime;
