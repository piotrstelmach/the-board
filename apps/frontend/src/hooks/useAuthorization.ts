import React from 'react';

export const useAuthorization = () => {
  const intervalRef = React.useRef(null);

  React.useEffect(() => {
    const currentInterval = setInterval(() => console.log('dupa'), 300);

    intervalRef?.current = currentInterval;

    return () => clearInterval(intervalRef?.current);
  }, []);
};
