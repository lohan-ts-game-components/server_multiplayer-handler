import { debug, timeStamp } from "console";
import { Security } from "./Security";
import { unpack, pack } from "msgpackr";
import { Client } from "./Client";

const port = process.env.PORT;
const debugMode = process.env.DEBUG_MODE;
const security = new Security();

let client: Client;

const server = Bun.serve({
  port: port,
  fetch(req, server) {
    // upgrade the request to a WebSocket
    if (server.upgrade(req)) {
      return; // do not return a Response
    }
    return new Response("Upgrade failed :(", { status: 500 });
  },
  websocket: {
    open(ws) {
      client = new Client(ws);
    },
    close(ws) {
      client.disconnect();
    },
    message(ws, packedData: Buffer) {
      const messageSecurity = security.antiDDoS(packedData);
      if (messageSecurity.success === false) {
        switch (messageSecurity.error) {
          case "TOO_MUCH_MESSAGES":
            ws.send("Too much messages send");
            break;
          case "MESSAGE_TOO_BIG":
            ws.send("Message too big : " + packedData.length + "Kb");
            break;
          default:
            ws.send("/!\\ Unknown error : " + messageSecurity.error);
            break;
        }
        return;
      }
      const data = unpack(packedData);

      if (debugMode) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        console.log("----------------------");
        console.log(`${hours}:${minutes}:${seconds} [message] client :`);
        console.log(data);
        console.log("----------------------");
      }

      if (data.message) {
        return;
      }

      if (data.clientDirection) {
        client.move(data.clientDirection);
        return;
      }

      if (data.gfs) {
        switch (data.gfs) {
          case "map":
            break;
        }
        return;
      }

      if (data.ufs) {
        switch (data.ufs) {
          case "clientpos":
            break;
        }
        return;
      }
    },
  }, // handlers
});
console.log(`Listening on ${server.hostname}:${server.port}`);
