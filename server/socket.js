import 'dotenv/config';

import { createServer } from 'http';
import { Server } from 'socket.io';

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {

  socket.on('call', (data) => {
    const { room, info } = data;
    io.to(room).emit('call', info);
  });

  socket.on('join_room', (data) => {
    const { room } = data;
    socket.join(room);
  });

  socket.on('leave_room', (data) => {
    const { room } = data;
    socket.leave(room);
  })

  socket.on('accept_order', (data) => {
    const { room, driver } = data;
    io.in(room).emit('accept_order', driver);
  });

  socket.on('reject_order', (data) => {
    const { room, orderId } = data;
    io.in(room).emit('reject_order', orderId);
  });

  socket.on('cancel_order', (data) => {
    const { room } = data;
    io.in(room).emit('cancel_order');
  });
});

server.listen(process.env.SOCKET_PORT, (err) => {
  if (err) console.error(err);
  console.log("Socket listening on PORT", process.env.SOCKET_PORT);
});




