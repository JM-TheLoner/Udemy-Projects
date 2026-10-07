import React, { useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  function typeTask(event) {
    const { value } = event.target;
    setNewTask(value);
    event.preventDefault();
  }

  function addTask(event) {
    setTasks((prevValue) => {
      return [...prevValue, newTask];
    });
    setNewTask("");
    event.preventDefault();
  }

  return (
    <div className="container">
      <div className="heading">
        <h1>To-Do List</h1>
      </div>
      <div className="form">
        <input type="text" onChange={typeTask} value={newTask} />
        <button onClick={addTask}>
          <span>Add</span>
        </button>
      </div>
      <div>
        <ul>
          {tasks.map((task) => {
            return <li>{task}</li>;
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
