import { Server } from "socket.io";
import http from "http";

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let msgs = [{ user: "test", content: "Hello!" }];

io.on("connection", (socket) => {
  socket.on("join", (data) => {
    socket.emit("new_user", msgs);
  });

  socket.on("msg", (data) => {
    msgs.push(data);
    const parsedData = data.user ? data : JSON.parse(data);
    socket.broadcast.emit("new_msg", {
      user: parsedData.user,
      content: parsedData.content,
    });
  });

  socket.on("disconnect", () => {});
});

io.listen(8080);
