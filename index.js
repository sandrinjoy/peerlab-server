const express = require("express");
const PORT = process.env.PORT || 3000;
console.log("The value of PORT is:", process.env);
const server = express().listen(PORT, () =>
  console.log(`Listening on ${PORT}`)
);
const { Server } = require("ws");

const wss = new Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("open", () => {
    ws.send("welcome to peerlab server");
  });
  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });

  ws.on("close", () => console.log("Client disconnected"));
});
