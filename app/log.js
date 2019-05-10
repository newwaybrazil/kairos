class Log {
  constructor(dateTime, colors) {
    this.date = dateTime;
    this.colors = colors;
  }

  debug(color, message) {
    console.log(
      this.colors[color],
      `${this.date.getDate()} - ${message}`,
    );
    return true;
  }
}
module.exports = Log;
