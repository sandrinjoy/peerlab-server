import { customAlphabet } from "nanoid";

import { WebSocketServer } from "ws";
import express from "express";
const PORT = process.env.PORT || 3000;
const nanoid = customAlphabet("abcdefghjkopqrstxyz", 5);
let users = {};
let labs = {};
const server = express()
  .get("/findlab", (req, res) => {
    const labId = req.query.id;
    if (!labs[labId]) {
      res.json({ valid: false });
    } else {
      res.json({ valid: true });
    }
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    messageController(ws, data);
  });
  ws.on("error", () => {});
  ws.on("close", () => {});
});

const messageController = (ws, data) => {
  const msg = JSON.parse(data.toString());
  switch (msg.type) {
    case "NEW_USER": {
      newUser(ws, msg.body);
    }
    case "FIND_USER": {
      findUser(ws, msg.body);
    }
    case "NEW_LAB": {
      newLab(ws, msg.body);
    }
    case "FIND_LAB": {
      findLab(ws, msg.body);
    }
    default: {
    }
  }
};

const newUser = (ws, data) => {};
const findUser = (ws, data) => {};
const newLab = (ws, data) => {
  const lab = nanoid();
  const res = {
    type: "NEW_LAB",
    payload: lab,
  };
  labs[lab] = {
    id: lab,
    users: [ws],
  };
  ws.send(JSON.stringify(res));
};
const findLab = (ws, data) => {};

// const newUser = (client) => {
//   const newId = nanoid();
//   if (!users[newId]) {
//     let newClient = client;
//     newClient.id = newId;
//     users[newId] = newClient;
//     client.send(
//       JSON.stringify({
//         type: "ID_GENERATED",
//         body: { id: users[newId].id },
//       })
//     );
//   }
//   console.log(users);
// };
const deleteUser = (client) => {
  try {
    delete users[client.userId];
  } catch {}
};
