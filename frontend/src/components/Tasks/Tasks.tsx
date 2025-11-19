import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Tasks.scss';

interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in progress' | 'completed';
  category?: string;
}

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Partial<Task>>({});
  const [editingTask, setEditingTask] = useState<Partial<Task> | null>(null);

  const fetchTasks = async () => {
    try {
      const res = await axios.get<Task[]>('http://localhost:5000/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    try {
      if (!newTask.title || !newTask.dueDate) return alert('Title and Due Date required');
      await axios.post('http://localhost:5000/api/tasks', newTask);
      setNewTask({});
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTask = async (task: Task) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${task._id}`, task);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (task: Task, status: Task['status']) => {
    try {
      await axios.patch(`http://localhost:5000/api/tasks/${task._id}/status`, { status });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="tasks-container">
      <h2>Задачі</h2>

      {/* Форма додавання */}
      <div className="add-task">
        <input
          type="text"
          placeholder="Назва завдання"
          value={newTask.title || ''}
          onChange={e => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="date"
          value={newTask.dueDate || ''}
          onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
        />
        <select
          value={newTask.priority || 'medium'}
          onChange={e => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
        >
          <option value="low">Низький</option>
          <option value="medium">Середній</option>
          <option value="high">Високий</option>
        </select>
        <button onClick={handleAddTask}>Додати</button>
      </div>

      {/* Список завдань */}
      <div className="task-list">
        {tasks.map(task => (
          <div key={task._id} className={`task-card ${task.status.replace(' ', '-')}`}>
            {editingTask?._id === task._id ? (
              <>
                <input
                  type="text"
                  value={editingTask.title || ''}
                  onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                />
                <input
                  type="date"
                  value={editingTask.dueDate || ''}
                  onChange={e => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                />
                <select
                  value={editingTask.priority || 'medium'}
                  onChange={e => setEditingTask({ ...editingTask, priority: e.target.value as Task['priority'] })}
                >
                  <option value="low">Низький</option>
                  <option value="medium">Середній</option>
                  <option value="high">Високий</option>
                </select>
                <button onClick={() => handleUpdateTask(editingTask as Task)}>Зберегти</button>
                <button onClick={() => setEditingTask(null)}>Скасувати</button>
              </>
            ) : (
              <>
                <h4>{task.title}</h4>
                <p>Статус: {task.status}</p>
                <p>Пріоритет: {task.priority}</p>
                <p>Термін: {new Date(task.dueDate).toLocaleDateString()}</p>
                <button onClick={() => setEditingTask(task)}>Редагувати</button>
                <button onClick={() => handleDeleteTask(task._id)}>Видалити</button>
                <select
                  value={task.status}
                  onChange={e => handleStatusChange(task, e.target.value as Task['status'])}
                >
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;
