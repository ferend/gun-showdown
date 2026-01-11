import path from 'path';
import http from 'http'
import express from 'express';
import { Server as SocketIOServer } from 'socket.io';
import {clientConnection} from './clientConnection'
//import mysql from 'mysql'

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);  
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// let db =  mysql.createPool({
//     host: '',
//     user: '',
//     password: '',
//     database: ''
//   });

//set up the routes that point web requests to the right files.
// When running from built-server/, __dirname is built-server/, so we go up one level to reach public/
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath)); 
app.get("/", (req, res) =>{
    res.sendFile(path.join(publicPath, "index.html"))
})
app.get("/mystyle.css", (req, res) =>{
    res.sendFile(path.join(publicPath, "mystyle.css"))
})
app.get("/front-bundle.js", (req, res) =>{
    res.sendFile(path.join(publicPath, "front-bundle.js"))
})
app.get("/assets/*", (req, res) =>{
    res.sendFile(path.join(publicPath, req.path))
})

//start the game communication server to handle player data
clientConnection(io);


//start the web server to distribute the games files.
server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
}).on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} is already in use!`);
    console.log(`💡 Try one of these solutions:`);
    console.log(`   1. Kill the process using port ${port}: netstat -ano | findstr :${port}`);
    console.log(`   2. Use a different port: set PORT=3001 && npm run start-server`);
    console.log(`   3. Or modify server.ts to use a different default port`);
    process.exit(1);
  } else {
    throw err;
  }
});
