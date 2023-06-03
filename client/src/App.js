import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const App = () => {

  const [socket, setSocket] = useState('');
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');



  useEffect(() => {
    const newSocket = io('ws://localhost:8000', { transports: ["websocket"] });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('addTask', (task) => addTask(task));
    newSocket.on('removeTask', ( id ) => removeTask(id));
    newSocket.on('updateData', (tasks) => updateTasks(tasks));

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);


  const removeTask = (taskId, shouldEmit) => {
    setTasks(tasks => tasks.filter(task => task.id !== taskId));

    if (shouldEmit) {
      socket.emit('removeTask',  taskId );
    }
  };
  const addTask = (task) => {
    setTasks(tasks => [...tasks, task]);
  };

  const updateTasks = (newTasks) => {
  setTasks(newTasks);
};

  const submitForm = (e) => {
    e.preventDefault();
   addTask({name:taskName,id: uuidv4()});
   socket.emit('addTask', {name:taskName,id: uuidv4()});
  };

  return (
    <div className="App">
  
      <header>
        <h1>ToDoList.app</h1>
      </header>
  
      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
  
        <ul className="tasks-section__list" id="tasks-list">
        {tasks.map((task) => (
          <li key={task.id} className="task">
            {task.name}
            <button className="btn btn--red" onClick={() => removeTask(task.id, true)}>Remove</button>
          </li>
        ))}
        </ul>
  
        <form id="add-task-form" onSubmit={submitForm} >
          <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" value= {taskName}
            onChange={(e) => setTaskName(e.target.value)} />
          <button className="btn" type="submit">Add</button>
        </form>
  
      </section>
    </div>
  );
}

export default App;