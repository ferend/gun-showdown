import {GameCommunication} from './gameComm'
import { UserData } from '../UserData'
import { Server as SocketIOServer } from 'socket.io'

export function clientConnection(io: SocketIOServer) {

  
  let currentUsers: UserData[] = [] //array to store socketids and player data of each connection

  
  io.on('connection', function (socket) {
    
    GameCommunication(io, socket, currentUsers)  
    
    //remove the users data when they disconnect.
    socket.on('disconnect', function () {
      removeUser(currentUsers, socket);
    });
  })

     setInterval(()=>{
    var time = new Date();
    console.log(currentUsers.length+" logged in @ "+ time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }))
     }, 5000) 
  }

function removeUser(currentUsers: UserData[], socket: any): void {
  const userIndex = currentUsers.findIndex((user: UserData) => user.socketId === socket.id);
  if (userIndex > -1) {
    const user = currentUsers[userIndex];
    socket.broadcast.emit("remove player", user.socketId);
    currentUsers.splice(userIndex, 1);
  }
  socket.removeAllListeners();
}

 