import { UserData } from '../UserData'

interface RecentData {
  socketId: string
  x: number
  y: number
  vx: number
  vy: number
  angle: number
}

export function GameCommunication(io: any, socket: any, currentUsers: UserData[]) {
  let recentUpdates: RecentData[] = [] 

  socket.on('player update', function (data: UserData) {
    let p = recentUpdates.filter(update => update.socketId == data.socketId)
    if (p && p[0]) {
      let player = p[0]
      player.x = data.x
      player.y = data.y
      player.angle = data.angle
      player.vx = data.vx
      player.vy = data.vy
    } else {
      recentUpdates.push(data)
    }
  })

  socket.on('ready', () => {
    let newPlayer = createNewUser(socket)
    socket.emit('first hi', newPlayer, currentUsers)
    socket.broadcast.emit('add opponent', newPlayer)
    currentUsers.push(newPlayer) 
  })

  socket.on('bullet_fired', (bulletData: any) => {
    socket.broadcast.emit('bullet_fired', bulletData)
  })

  socket.on('player_hit', (data: { playerSocketId: string }) => {
    const hitSocket = currentUsers.find(user => user.socketId === data.playerSocketId);
    if (hitSocket) {
      io.to(hitSocket.socketId).emit('player_hit', data);
    }
  });

  const updateInterval = setInterval(() => {
    io.emit('update all', recentUpdates)
    recentUpdates.forEach(data => {
      let p = currentUsers.filter((user: UserData) => {
        return user.socketId == data.socketId
      })
      if (p && p[0]) {
        let player = p[0]
        player.x = data.x
        player.y = data.y
        player.angle = data.angle
        player.vx = data.vx
        player.vy = data.vy
      }
    })
    recentUpdates.length = 0
  }, 1000 / 30) // ~33ms for ~30 FPS updates

  // Clean up interval on disconnect
  socket.on('disconnect', () => {
    clearInterval(updateInterval)
  })

  function createNewUser(socket) {
    let d = new Date()
    let time = d.toLocaleString('en-US', {
      hour12: true,
      timeZone: 'America/Los_Angeles'
    })

    let user: UserData = {
      socketId: socket.id,
      loginTime: new Date().getTime(),
      x: 200 + Math.random() * 600,
      y: 100 + Math.random() * 200,
      angle: Math.random() * 180,
      color: '0x' + Math.floor(Math.random() * 16777215).toString(16),
      vx: 1 - Math.random() * 2,
      vy: 1 - Math.random() * 2
    }
    return user
  }
}
