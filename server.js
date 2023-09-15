const server = require("express")();
const http = require("http").Server(server);
const io = require("socket.io")(http, {
  cors: {origin: "*"}
});

let players = [];

// Start the server, a user is connected.
io.on("connection", socket => {
  console.log("a user connected " + socket.id);
  
  players.push(socket.id);

  if(players.length == 1){
    io.emit("isplayerA");
  }
  
  socket.on("disconnect", () => {
    console.log("user disconnected " + socket.id);
    // Remove the player from the list.
    players = players.filter(player => player != socket.id);
  });

});

http.listen(3000, () => {
  console.log(" Server started "+ " listening on *:3000");
});