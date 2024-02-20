const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const formatMessage = require("./utils/messages");
const botName = "ChatCord Bot";
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
const dotenv = require("dotenv").config();
const PORT = 3000;
const path = require("path");
const socketio = require("socket.io");
const io = socketio(server);
const userRoute = require("./routes/UserRoutes");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(userRoute);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    socket.emit("message", formatMessage(username, "Welcome to chatcord"));
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(user.username, ` ${user.username} has joined chat`)
      );

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(user.username, `${user.username} has left chat`)
      );
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});
app.use(cors);
server.listen(PORT || 3000, () => {
  console.log(`server is running on port ${PORT}`);
});
