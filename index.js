import { customAlphabet } from "nanoid";

import { WebSocketServer } from "ws";
import express from "express";
import cors from "cors";
const PORT = process.env.PORT || 3000;
const nanoid = customAlphabet("abcdefghjkopqrstxyz", 5);
let users = {};
let labs = {};
const server = express()
  .use(cors())
  .get("/findlab", (req, res) => {
    const labId = req.query.id;
    if (!labs[labId]) {
      res.json({ valid: false, id: labId });
    } else {
      res.json({ valid: true, id: labId });
    }
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  const res = {
    type: "WS_SUCCESS",
  };
  ws.send(JSON.stringify(res));

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
      newUser(ws, msg.payload);
      break;
    }
    case "FIND_USER": {
      findUser(ws, msg.body);
      break;
    }
    case "NEW_LAB": {
      newLab(ws, msg);
      break;
    }
    case "JOIN_LAB": {
      findLab(ws, msg.payload);
      break;
    }
    default: {
    }
  }
};

const newUser = (ws, userId) => {
  users[userId] = {
    id: userId,
    ws: ws,
  };
  const res = {
    type: "VALIDATE_USER",
    payload: users[userId].id,
  };
  ws.send(JSON.stringify(res));
};
const findUser = (ws, data) => {};
const newLab = (ws, data) => {
  const lab = nanoid();
  const res = {
    type: "NEW_LAB",
    payload: {
      id: lab,
    },
  };
  labs[lab] = {
    id: lab,
    users: [ws],
  };
  ws.send(JSON.stringify(res));
};
const findLab = (ws, labId) => {
  console.log("HI");
  const valid = labId in labs;

  const res = {
    type: "JOIN_LAB",
    payload: {
      valid,
      id: labId,
    },
  };
  ws.send(JSON.stringify(res));
};

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
