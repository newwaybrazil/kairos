class DateTime {
  alwaysTwoDigits(number) {
    let result = number;
    if (result < 10) {
      result = `0${result}`;
    }
    return String(result);
  }

  getFullYear() {
    const currentDate = new Date();
    return currentDate.getFullYear();
  }

  getMonth() {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    return this.alwaysTwoDigits(month);
  }

  getDay() {
    const currentDate = new Date();
    const day = currentDate.getDate();
    return this.alwaysTwoDigits(day);
  }

  getHours() {
    const currentDate = new Date();
    const hours = currentDate.getHours();
    return this.alwaysTwoDigits(hours);
  }

  getMinutes() {
    const currentDate = new Date();
    const mins = currentDate.getMinutes();
    return this.alwaysTwoDigits(mins);
  }

  getSeconds() {
    const currentDate = new Date();
    const secs = currentDate.getSeconds();
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
