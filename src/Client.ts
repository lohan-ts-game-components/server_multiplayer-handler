///<reference lib="dom"/>

import { pack } from "msgpackr";
import { Utils } from "./Utils";

interface Direction {
  up: number;
  right: number;
  down: number;
  left: number;
}

export class Client {
  private _ws: WebSocket;
  private _id: String;
  private _x: number;
  private _y: number;
  private _speed: number;
  private _mapHeight: number = 600;
  private _mapWidth: number = 900;
  private _direction: Direction = { up: 0, right: 0, down: 0, left: 0 };
  private _directionInterval: Timer | undefined;

  constructor(ws: WebSocket) {
    this._ws = ws;
    this._id = Utils.generateId();
    this._x = 30;
    this._y = 30;
    this._speed = 10;

    console.log("[->] Client connected");
    const msg = { info: "connected: " + this._id };
    this._ws.send(JSON.stringify(msg));
    this._ws.send(
      JSON.stringify({ clientPosition: { x: this._x, y: this._y } })
    );
  }

  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  get mapHeight() {
    return this._mapHeight;
  }
  get mapWidth() {
    return this._mapWidth;
  }

  public move(direction: Direction) {
    this._direction = direction;
    clearInterval(this._directionInterval);

    /**
     * Translation
     */
    if (
      this._direction.up != 0 ||
      this._direction.right != 0 ||
      this._direction.down != 0 ||
      this._direction.left != 0
    ) {
      const distance = this._speed;
      const dx = -((direction.left - direction.right) * distance);
      const dy = -((direction.up - direction.down) * distance);

      this._directionInterval = setInterval(() => {
        const newX = this._x + dx;
        const newY = this._y + dy;
        if (newX > 0 && newX < this._mapWidth) {
          this._x = newX;
        }
        if (newY > 0 && newY < this._mapHeight) {
          this._y = newY;
        }
        this._ws.send(
          JSON.stringify({ clientPosition: { x: this._x, y: this._y } })
        );
      }, 25);
    }
  }

  public disconnect() {
    this._ws.close();
    console.log("[<-] Client disconnected");
  }
}
