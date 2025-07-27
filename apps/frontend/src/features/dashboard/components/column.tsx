import { FC, ReactNode } from 'react';

interface ColumnProps {
  title: string;
  children: ReactNode;
}

export const Column: FC<ColumnProps> = ({ title, children }) => {
  return (
    <div className="w-72 flex-shrink-0 bg-gray-100 dark:bg-gray-900 rounded-xl p-4 shadow-md">
      <h2 className="text-lg font-bold mb-4 text-gray-700 dark:text-gray-200">
        {title}
      </h2>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
};
