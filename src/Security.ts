///<reference lib="dom"/>

import { unpack } from "msgpackr";
import { Logs } from "./Logs";

export class Security {
  private _messageCount = 0;
  private _lastMessageTimestamp = Date.now();
  private readonly _RATE_LIMIT_INTERVAL = Number(
    process.env.RATE_LIMIT_INTERVAL
  );
  private readonly _MAX_MESSAGES_PER_INTERVAL = Number(
    process.env.MAX_MESSAGES_PER_INTERVAL
  );
  private readonly _MAX_MESSAGE_SIZE = Number(process.env.MAX_MESSAGE_SIZE);
  private readonly _logs = new Logs();

  public static returnSafeString(unsafeString: String) {
    return unsafeString
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  public antiDDoS(message: Buffer) {
    const currentTime = Date.now();

    if (currentTime - this._lastMessageTimestamp >= this._RATE_LIMIT_INTERVAL) {
      this._messageCount = 0;
      this._lastMessageTimestamp = Date.now();
    }

    if (this._messageCount >= this._MAX_MESSAGES_PER_INTERVAL) {
      console.log(this._messageCount);
      this._logs.error("Trop de messages", unpack(message).message);
      return { success: false, error: "TOO_MUCH_MESSAGES" }; // Trop de messages sur un laps de temps définit
    }
    this._messageCount++;

    if (message.length >= this._MAX_MESSAGE_SIZE) {
      this._logs.error("Message trop grand", message.length);
      return { success: false, error: "MESSAGE_TOO_BIG" }; // Message trop grand
    }

    return { success: true, error: null };
  }
}
