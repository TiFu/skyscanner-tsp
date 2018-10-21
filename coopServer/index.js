const io = require('socket.io')(8990)
io.set('origins', '*:*')

const roomIds = {}

const createIfNotExists = (roomId) => {
  if (typeof roomIds[roomId] === 'undefined') {
    roomIds[roomId] = {
      userCount: 0,
      mouseBroadcasts: {},
      tempPaths: {},
    }
  }
}

try {
  io.on('connect', (socket) => {
    let username = null
    let roomId = null
    
    socket.on('register', ({ user, id }) => {
      console.log('registering', user, id)
      username = user
      roomId = id
  
      createIfNotExists(roomId)
      roomIds[roomId].userCount++;
      console.log('sending', roomIds[roomId])
      socket.emit('room_state', { id: roomId, data: roomIds[roomId] })
    })

    socket.on('poll', () => {
      socket.emit('room_state', { id: roomId, data: roomIds[roomId] })
    })
    
    socket.on('mouse_location', ({ lat, lng }) => {
      createIfNotExists(roomId)
      roomIds[roomId].mouseBroadcasts[username] = { lat, lng }
    })

    socket.on('temp_coords', (temp) => {
      createIfNotExists(roomId)
      roomIds[roomId].tempPaths[username] = temp
    })
  
    socket.on('disconnect', () => {
      console.log('disconnecting')
      if (roomIds[roomId]) {
        delete roomIds[roomId].mouseBroadcasts[username];
        delete roomIds[roomId].tempPaths[username];
        roomIds[roomId].userCount--;
        socket.emit('room_state', { id: roomId, data: roomIds[roomId] })
      }
    })
  })

} catch (err) {}  

console.log('Starting coop server')