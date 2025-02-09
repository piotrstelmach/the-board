// import { Link } from 'react-router';
// import { AppRoutes } from './router';
import { useRefreshToken } from '../hooks/useRefreshToken';
// import { ThemeSwitchButton } from '../components/themeSwitchButton';
import { Layout } from '../components/layout';

export function App() {
  useRefreshToken();

  return (
    <>
      <Layout />
    </>
    // <div>
    //   <br />
    //   <hr />
    //   <br />
    //   <div role="navigation">
    //     <ul>
    //       <li>
    //         <Link to="/">Home</Link>
    //       </li>
    //       <li>
    //         <Link to="/login">login</Link>
    //       </li>
    //       <li>
    //         <Link to="/register">register</Link>
    //       </li>
    //       <li>
    //         <Link to="/dashboard">dashboard</Link>
    //       </li>
    //     </ul>
    //   </div>
    //   <ThemeSwitchButton />
    //   <AppRoutes />
    // </div>
  );
}

export default App;
