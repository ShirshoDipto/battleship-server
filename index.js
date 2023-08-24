require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");

const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Server is running...");
});

const server = http.createServer(app);

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});

setInterval(() => {
  axios
    .get(`${process.env.SERVER}`)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}, 1000 * 60 * 10);

const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_ORIGINAL, process.env.CLIENT_LOCAL],
  },
});

const rooms = io.sockets.adapter.rooms;
const players = {};

function generateCode() {
  return Math.floor(Math.random() * 9000) + 1000;
}

function alterPlayerAndBoardData(code, player, board) {
  player.roomId = code;
  player.id = "opponent";
  board.playerId = "opponent";
}

io.on("connection", (socket) => {
  console.log("A player has joined. ");

  socket.on("createGame", ({ player, board }) => {
    let code = generateCode();
    while (rooms.has(code)) {
      code = generateCode();
    }

    players[code] = { player, board };

    socket.join(code);
    socket.emit("created", code);
  });

  socket.on("joinGame", ({ code, player, board }) => {
    if (rooms.has(code) && rooms.get(code).size < 2) {
      alterPlayerAndBoardData(code, player, board);
      socket.join(code);
      socket.to(code).emit("joined", { player, board });

      const host = players[code];
      alterPlayerAndBoardData(code, host.player, host.board);
      socket.emit("receiveHostData", host);
      delete players[code];
    } else {
      socket.emit("error", "Game with this code does not exist. ");
    }
  });

  socket.on("leaveRoom", ({ roomId, isGameOver }) => {
    if (roomId && rooms.has(roomId)) {
      rooms.get(roomId).forEach((socketId) => {
        io.sockets.sockets.get(socketId).leave(roomId);
      });

      if (!isGameOver) {
        socket.to(roomId).emit("error", "Opponent has left the game. ");
      }
      if (players[roomId]) {
        delete players[roomId];
      }
    }
  });

  socket.on("attack", ({ code, coord }) => {
    if (rooms.has(code)) {
      socket.to(code).emit("receiveAttack", coord);
    } else {
      socket.emit("error", "Opponent has left the game. ");
    }
  });

  socket.on("disconnect", () => {
    console.log("A player has left. ");
  });
});
