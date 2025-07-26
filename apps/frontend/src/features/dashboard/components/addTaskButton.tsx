import { FC } from 'react';

interface AddTaskButtonProps {
  onClick: () => void;
}

export const AddTaskButton: FC<AddTaskButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="mt-2 w-full text-sm font-medium text-blue-600 hover:underline"
    >
      + Add Task
    </button>
  );
};
