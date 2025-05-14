//const argv = require("minimist")(process.argv.slice(2));
//var io = require("socket.io");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const path = require("path");
const { Server } = require("socket.io");
const io = new Server(server);

html_path = path.join(__dirname, "../public_html/");

const port = 8447; // assigned by my hosting
//var port = argv["p"];
//if (port === null || port === undefined) {
//  port = 3000;
//}

//app.get("/", (req, res) => {
//  res.sendFile(html_path + "/chat.html");
//});

app.use(express.static(html_path)); // serve all the files
app.get("/chat", (req, res) => {
  res.sendFile(html_path + "/chat.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg); // for no echo back io.broadcast.emit
    console.log("message: " + msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => {
  console.log("listening on *:" + port);
});

//const io = new Server({
//  /* options */
//});

//io.on("connection", (socket) => {
// ...
//});/

//io.listen(port);
