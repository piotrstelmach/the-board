import { FC } from 'react';
import { TaskPriority, TaskStatus } from '@prisma/client';

interface CardProps {
  title: string;
  description?: string;
  status: TaskStatus;
  assignee?: string;
  tags?: string[];
  dueDate?: string;
  priority?: TaskPriority;
  onClick?: () => void;
}

export const Card: FC<CardProps> = ({
  title,
  description,
  status,
  assignee,
  tags = [],
  dueDate,
  priority,
  onClick,
}) => {
  const priorityColor = {
    LOW: 'bg-green-500',
    MEDIUM: 'bg-yellow-500',
    HIGH: 'bg-red-500',
    CRITICAL: 'bg-red-600',
  }[priority || 'LOW'];

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-md"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-base text-gray-800 dark:text-gray-100">
          {title}
        </h3>
        {priority && (
          <span className={`w-2 h-2 rounded-full mt-1 ${priorityColor}`} />
        )}
      </div>

      {description && (
        <p className="text-sm mt-1 text-gray-600 dark:text-gray-300 line-clamp-2">
          {description}
        </p>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
        {dueDate && (
          <span className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 4h10M5 11h14M5 15h14M5 19h14"
              />
            </svg>
          </span>
        )}

        {assignee && <span className="italic">@{assignee}</span>}
      </div>
    </div>
  );
};
