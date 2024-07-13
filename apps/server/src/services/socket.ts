import { Server } from "socket.io";
import Redis from "ioredis";

const pub = new Redis({
  host: "caching-10693aee-tusharmaurya43-f6ab.f.aivencloud.com",
  port: 14673,
  username: "default",
  password: "",
});
const sub = new Redis({
  host: "caching-10693aee-tusharmaurya43-f6ab.f.aivencloud.com",
  port: 14673,
  username: "default",
  password: "",
});

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Init Socket Service");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });

    sub.subscribe("MESSAGES");
  }

  public initListener() {
    const io = this.io;

    console.log("Init Socket Listeners");
    io.on("connect", (socket) => {
      console.log(`New Socket Connected`, socket.id);

      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message Received", message);
        // publish this message to redis
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    sub.on("message", (channel, message) => {
      if (channel === "MESSAGES") {
        io.emit("message", message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
