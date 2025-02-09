import React from 'react';
import { Menu } from './menu';

export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <Menu />
      {children}
    </>
  );
};
