const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 });

server.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", (data) => {
    const message = JSON.parse(data);
    console.log(`${message.sender}: ${message.message}`);

    // Broadcast the message to all connected clients
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  });

  socket.on("close", () => {
    console.log("A user disconnected");
  });
});

console.log("WebSocket server running on ws://localhost:8080");