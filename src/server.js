//import { createRequire } from "module"; <-- This is something called ES. Don't use it

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const path = require("path");
//const __dirname = path.resolve();
const dotenv = require('dotenv');
const { Server } = require("socket.io");
const io = new Server(server);

const bcrypt = require("bcryptjs");

app.use(express.urlencoded({extended: 'false'}));
app.use(express.json());


// here's the DB specific part:
var pg = require("pg");


// get sensitive authorisations from outside the script
dotenv.config({ path: './.env'});

var connectionString = {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE
};
var pool = new pg.Pool(connectionString);

//client.connect();
//client.on('error', (err) => {
//  console.error('something bad has happened!', err.stack)
//});

//console.error("WTF");
const html_path = path.join(__dirname, "../public_html/");
const data_path = path.join(__dirname, "../data/");
const template_path = path.join(__dirname, "../templates/");

const port = 8447; // assigned by my hosting
//var port = argv["p"];
//if (port === null || port === undefined) {
//  port = 3000;
//}

//app.get("/", (req, res) => {
//  res.sendFile(html_path + "/chat.html");
//});

app.use(express.static(html_path)); // serve all the files

app.get("/auth", (req, res) => {

  return res.render(path.join(template_path, 'login_error.ejs'), {
    message: 'Try again',
    problem: false // true shows the message, false hides. The html needs work
  })

});

app.post("/auth", (req, res) => {

  const { name, password } = req.body;

  // is there anyone already in the DB?
  pool.query('SELECT name FROM users WHERE name = ?', [name], async (error, res) => {
         // remaining code goes here
      if(error){
        console.log(error)
      };

      if (res.length > 0) {
        // yes, so is the password right?
        pool.query('SELECT * FROM users WHERE name = ? AND password = ?', [name, password], function(error, results, fields) {
          // If there is an issue with the query, output the error
          if (error) { console.log(error); };
          if (results.length > 0) {
            // Authenticate the user
            request.session.loggedin = true;
            request.session.username = username;
            // Redirect to home page
            response.redirect('/chat');
          } else {
            // the password and username don't match
            return res.render(path.join(templatepath, 'login_error.ejs'), {
              message: 'Incorrect password or user name already in use'
            })
          };
        });
        } else {
        // new user
        response.redirect('/chat');
        }
  })

  response.redirect('/chat');
  //res.sendFile(html_path + "/chat.html");

});



app.get("/chat", (req, res) => {
  res.sendFile(html_path + "/chat.html");
});

app.get("/json", (req, res) => {
  //res.sendFile(html_path + "/chat.html");
  res.sendFile(data_path + "/Moo.JSON");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg); // for no echo back io.broadcast.emit
    console.log("message: " + msg);
  });
  socket.on("OSC", (msg) => {
    //io.broadcast("OSC", msg); // for no echo back io.broadcast.emit
    io.emit("OSC", msg)
    console.log("OSC: " + msg);
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
