///<reference lib="dom"/>

export class Logs {
  private readonly _fs = require("fs");

  public description(message: string, value: any) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${message}\n${value}\n----------`;
    this._fs.appendFile("logs/description.log", logMessage, (err) => {
      if (err) {
        console.error("Can't write in description.log : ", err);
      }
    });
  }

  public error(message: string, value: any) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${message}\n${value}\n----------`;
    this._fs.appendFile("logs/error.log", logMessage, (err) => {
      if (err) {
        console.error("Can't write in error.log : ", err);
      }
    });
  }

  public debug(message: string, value: any) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${message}\n${value}\n----------`;
    this._fs.appendFile("logs/debug.log", logMessage, (err) => {
      if (err) {
        console.error("Can't write in debug.log : ", err);
      }
    });
  }
}
