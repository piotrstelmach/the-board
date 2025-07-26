import { FC } from 'react';
import { Column } from './column';
import { Card } from './card';
import { AddTaskButton } from './addTaskButton';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'inprogress' | 'done';
  assignee?: string;
  tags?: string[];
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface BoardProps {
  tasks: Task[];
  onTaskClick?: (taskId: string) => void;
  onAddTask?: (status: string) => void;
}

export const Board: FC<BoardProps> = ({ tasks, onTaskClick, onAddTask }) => {
  const grouped = {
    todo: tasks.filter((t) => t.status === 'todo'),
    inprogress: tasks.filter((t) => t.status === 'inprogress'),
    done: tasks.filter((t) => t.status === 'done'),
  };

  return (
    <div className="flex gap-6 overflow-x-auto px-6 pb-4">
      {Object.entries(grouped).map(([status, taskList]) => (
        <Column key={status} title={status.toUpperCase()}>
          {taskList.map((task) => (
            <Card
              key={task.id}
              title={task.title}
              description={task.description}
              status={task.status}
              assignee={task.assignee}
              tags={task.tags}
              dueDate={task.dueDate}
              priority={task.priority}
              onClick={() => onTaskClick?.(task.id)}
            />
          ))}
          <AddTaskButton onClick={() => onAddTask?.(status)} />
        </Column>
      ))}
    </div>
  );
};
