import { createContext, useState, useContext } from "react";
import {
  createTaskRequest,
  getTasksRequest,
  deleteTaskRequest,
  getTaskRequest,
  updateTaskRequest,
} from "../api/tasks.js";

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error("useTasks must be used within an AuthProvider ");
  }
  return context;
};

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  //obtener tareas
  const getTasks = async () => {
    try {
      const res = await getTasksRequest();
      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  //crear tarea
  const createTask = async (task) => {
    const res = await createTaskRequest(task);
    console.log(res);
  };
//borrar tarea
  const deleteTask = async (id) => {
    try {
      const res = await deleteTaskRequest(id);
      if (res.status === 204) setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const  getTask = async (id) => {
   try {
    const res = await getTaskRequest(id);
    return res.data
   } catch (error) {
    console.log(error);
   }
  }

  const  updateTask = async (id, task) => {
    try {
     const res = await updateTaskRequest(id, task);
     return res.data
    } catch (error) {
     console.log(error);
    }
   }
  return (
    <TaskContext.Provider value={{ tasks, createTask, getTasks, deleteTask, getTask , updateTask}}>
      {children}
    </TaskContext.Provider>
  );
}
