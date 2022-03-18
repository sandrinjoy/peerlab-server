const express = require("express");
const PORT = process.env.PORT || 3000;
const server = express()
  .get("/*", (req, res) => {
    res.redirect("https://peerlab.vercel.app");
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const { Server } = require("ws");

const wss = new Server({ server });
let labs = {};
wss.on("connection", (client) => {
  client.on("open", () => {});
  client.on("message", function message(data) {
    client.send("welcome to peerlab server");
  });
  client.on("error", (err) => {
    client.close();
  });

  client.on("close", () => console.log("Client disconnected"));
});
