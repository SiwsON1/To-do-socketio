const express = require('express');
const cors = require('cors');
const app = express();
const socket = require('socket.io');



const tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running...');
  });

  app.use(cors({
    origin: 'http://localhost:3000'
  }));


  app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
  });

  const io = socket(server);

  io.on('connection', (socket) => {
    console.log('New client! Its id' + socket.id);
    socket.emit('updateData', tasks);

    socket.on('addTask', (task) => { console.log('Oh, I\'ve got new task from ' + socket.id);
    tasks.push(task);
    console.log('Add new task:', task);
    socket.broadcast.emit('addTask', task);
    });
    socket.on('removeTask', (taskId) => {
      const taskIndex = tasks.findIndex((task) => task.id === taskId);
      if (taskIndex !== -1) {
        const removedTask = tasks.splice(taskIndex, 1)[0];
        console.log('Deleted task with id:', taskId);
        socket.broadcast.emit('removeTask', removedTask.id);
      }
    });
   });
