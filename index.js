require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Home page");
});

const server = http.createServer(app);

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT],
  },
});

// io.use(async (socket, next) => {
//   const user = socket.handshake.auth.user;
//   if (!user) {
//     return next(new Error("User must be provided."));
//   }

//   next();
// });

io.on("connection", (socket) => {
  console.log("A player is connected. ");
});
