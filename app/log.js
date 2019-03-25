class Log {
  constructor(dateTime, colors) {
    this.date = dateTime;
    this.colors = colors;
  }

  debug(color, message) {
    // eslint-disable-next-line no-console
    console.log(
      this.colors[color],
      `${this.date.getDate()} - ${message}`,
    );
    return true;
  }
}
module.exports = Log;
