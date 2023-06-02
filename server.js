const express = require('express');
const app = express();
const socket = require('socket.io');
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000'
  }));

const tasks = [
];

const server = app.listen(process.env.PORT || 8001, () => {
    console.log('Server is running...');
  });

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
    socket.broadcast.emit('task', task);
    });
    socket.on('removeTask', (taskId) => { 
        const taskIndex = tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
            const removedTask = tasks.splice(taskIndex, 1);
            console.log('Deleted task at given id:', taskId);

            socket.broadcast.emit('removeTask', taskId);
          }
    });
   });
