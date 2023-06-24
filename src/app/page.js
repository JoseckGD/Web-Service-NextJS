"use client"
import { useState, useEffect } from 'react';

export default function Home() {

  const [tasks, setTasks] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [modifyTask, setModifyTask] = useState(false);
  const [modifyTaskData, setModifyTaskData] = useState(null);

  useEffect(() => {
    // Obtener todas las tareas al cargar la página
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks/0');

      const data = await response.json();
      console.log(data);
      setTasks(data.data);
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
    }
  };

  const createTask = async () => {
    if (!newTaskTitle && !newTaskDescription) {
      return;
    }
    try {
      const response = await fetch('/api/tasks/0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTaskTitle, description: newTaskDescription }),
      });
      const data = await response.json();

      if (data.status === true) {
        // Actualizar la lista de tareas
        fetchTasks();
        // Limpiar los campos de entrada
        setNewTaskTitle('');
        setNewTaskDescription('');
      } else {
        console.error('Error:', data);
      }
    } catch (error) {
      console.error('Error al crear la tarea:', error);
    }
  };

  const updateTask = async (updatedId, updatedTitle, updatedDescription) => {
    try {
      const response = await fetch(`/api/tasks/0`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: updatedId, title: updatedTitle, description: updatedDescription }),
      });
      const data = await response.json();

      if (data.status === true) {
        // Actualizar la lista de tareas
        fetchTasks();

        console.log(data);

        setModifyTask(false)
        setModifyTaskData(null)
        setNewTaskTitle('')
        setNewTaskDescription('')

      } else {
        console.error('Error:', data);
      }
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
    }
  };

  const deleteTask = async (taskId) => {

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        params: { taskId },
        body: JSON.stringify({ id: taskId }),
      });
      const data = await response.json();

      if (data.status === true) {
        // Actualizar la lista de tareas
        fetchTasks();
      } else {
        console.error('Error:', data);
      }
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
    }
  };


  const handleModify = (taskModify) => {
    setModifyTask(true);
    setNewTaskTitle(taskModify.title)
    setNewTaskDescription(taskModify.description)
    setModifyTaskData(taskModify)
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 gap-4">
      <h1 className="text-6xl font-bold text-center p-4 ">
        Web Service Rest in Next.js
      </h1>

      <nav className='bg-slate-900 p-4 rounded-2xl flex flex-row gap-4'>
        <input
          type="text"
          className="w-64 p-4 bg-white border border-gray-300 rounded-lg 
          shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
          text-black"
          placeholder="Título de tarea"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />

        <input
          type="text"
          className="w-64 p-4 bg-white border border-gray-300 rounded-lg shadow-sm 
          focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
          placeholder="Descripción de la tarea"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        />

        <button
          className="px-4 py-2 text-white bg-green-500 rounded-lg shadow-sm 
          hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 
          focus:ring-opacity-50"
          onClick={() => modifyTask === true ?
            updateTask(modifyTaskData.id, newTaskTitle, newTaskDescription) : createTask()}
        >
          {modifyTask === true ? 'Modifcar tarea' : 'Crear tarea'}
        </button>
      </nav>

      {tasks &&
        <ul className="space-y-4 w-3/4">
          {tasks.map((task) => (
            <li key={task.id} className="bg-white rounded-lg shadow-md p-4 flex items-center 
            flex-row justify-between">
              <div className='flex gap-4 items-center'>
                <h1 className=" text-gray-950 text-2xl px-4 font-black">{task.id}</h1>
                <div>
                  <h2 className=" text-gray-800 text-lg font-medium">{task.title}</h2>
                  <p className="text-gray-500">{task.description}</p>
                </div>
              </div>
              <div className='flex gap-4 items-center'>
                <button onClick={() => deleteTask(task.id)} className="px-4 py-2 bg-red-500 
                text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 
                focus:ring-red-500 focus:ring-opacity-50">Eliminar</button>
                <button onClick={() => handleModify(task)} className="px-4 py-2 bg-blue-500 
                text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 
                focus:ring-blue-500 focus:ring-opacity-50">Modificar</button>
              </div>
            </li>
          ))}
        </ul>
      }
    </main>
  )
}