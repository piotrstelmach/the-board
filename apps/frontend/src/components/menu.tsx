import {
  Button,
  Collapse,
  IconButton,
  Navbar,
  Typography,
} from '@material-tailwind/react';
import { Link } from 'react-router';
import React from 'react';
import { ThemeSwitchButton } from './themeSwitchButton';

export const Menu = () => {
  const [openNav, setOpenNav] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener(
      'resize',
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6 text-text-primary-light dark:text-text-primary-dark">
      <Typography as="li" variant="small" className="p-1 font-normal">
        <Link to="/">Home</Link>
      </Typography>
      <Typography as="li" variant="small" className="p-1 font-normal">
        <Link to="/dashboard">Dashboard</Link>
      </Typography>
      <Typography as="li" variant="small" className="p-1 font-normal">
        <ThemeSwitchButton />
      </Typography>
    </ul>
  );

  return (
    <Navbar className="mx-auto max-w-screen-xl px-6 py-3 bg-surface-light dark:bg-surface-dark">
      <div className="flex items-center justify-between">
        <Typography
          as="a"
          href="/"
          className="mr-4 cursor-pointer py-1.5 font-medium text-text-primary-light dark:text-text-primary-dark"
        >
          The Board
        </Typography>
        <div className="flex items-center gap-4">
          <div className="mr-4 hidden lg:block">{navList}</div>
          <div className="flex items-center gap-x-1">
            <Button
              variant="text"
              size="sm"
              className="hidden lg:inline-block text-text-primary-light dark:text-text-primary-dark"
            >
              <Link to="/login">Login</Link>
            </Button>
            <Button
              variant="gradient"
              size="sm"
              className="hidden lg:inline-block"
            >
              <Link to="/register">Sign In</Link>
            </Button>
          </div>
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 bg-transparent focus:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </IconButton>
        </div>
      </div>
      <Collapse open={openNav}>
        {navList}
        <div className="flex items-center gap-x-1">
          <Button fullWidth variant="text" size="sm" className="">
            <Link to="/login">Login</Link>
          </Button>
          <Button fullWidth variant="gradient" size="sm" className="">
            <Link to="/register">Sign In</Link>
          </Button>
        </div>
      </Collapse>
    </Navbar>
  );
};
