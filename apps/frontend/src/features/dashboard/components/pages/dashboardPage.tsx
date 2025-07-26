import { Board, Task } from '../board';
import { useState } from 'react';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design login page',
    description: 'Create UI for login with Tailwind.',
    status: 'todo',
    assignee: 'alice',
    tags: ['UI', 'Frontend'],
    dueDate: '2025-07-30',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Implement auth API',
    description: 'Create Express.js route for login/register.',
    status: 'inprogress',
    assignee: 'bob',
    tags: ['Backend'],
    dueDate: '2025-07-28',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Write unit tests',
    description: 'Test login form validation.',
    status: 'todo',
    assignee: 'carol',
    tags: ['Test'],
    dueDate: '2025-08-01',
    priority: 'low',
  },
  {
    id: '4',
    title: 'Deploy to staging',
    description: 'Create staging env with Docker Compose.',
    status: 'done',
    assignee: 'dan',
    tags: ['DevOps'],
    dueDate: '2025-07-25',
    priority: 'medium',
  },
];

const DashboardPage = () => {
  const [tasks, setTasks] = useState(mockTasks);

  const handleAddTask = (status: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: 'New Task',
      status: 'todo',
      assignee: 'me',
      priority: 'low',
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const handleTaskClick = (taskId: string) => {
    alert(`Clicked task with ID: ${taskId}`);
  };

  return (
    <div>
      <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Project Dashboard
        </h1>
        <Board
          tasks={tasks}
          onAddTask={handleAddTask}
          onTaskClick={handleTaskClick}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
