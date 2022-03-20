import { nanoid } from "nanoid";
import { WebSocketServer } from "ws";
const PORT = process.env.PORT || 3000;

let users = {};
let labs = {};

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
  ws.on("message", (data) => {});
  ws.on("error", () => {});
  ws.on("close", () => {});
});

// wss.on("connection", (client) => {
//   client.on("open", () => {
//     const userID = nanoid();
//     users[userID] = client;
//     console.log("hi");
//   });
//   client.on("message", (data) => {
//     //     users[userId] = client; managing users
//     const msg = JSON.parse(data.toString());

//     if (msg.type === "NEW_USER") {
//       newUser(client);
//     }
//     const isLab = labs.find(({ id }) => id === msg.id);
//     if (!isLab) {
//       labs.push(msg);
//       // client.send("Room Created");
//     } else {
//       // client.send("room already exists");
//     }

//     console.log(isLab);

//     // client.send("welcome to peerlab server");
//   });
//   client.on("error", (err) => {
//     console.log(err);
//     client.close();
//   });

//   client.on("close", () => {
//     deleteUser(client);
//   });
// });

const newUser = (client) => {
  const newId = nanoid();
  if (!users[newId]) {
    let newClient = client;
    newClient.id = newId;
    users[newId] = newClient;
    client.send(
      JSON.stringify({
        type: "ID_GENERATED",
        body: { id: users[newId].id },
      })
    );
  }
  console.log(users);
};
const deleteUser = (client) => {
  try {
    delete users[client.userId];
  } catch {}
};
