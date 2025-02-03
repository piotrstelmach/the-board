import { Link } from 'react-router';
import { AppRoutes } from './router';

export function App() {
  return (
    <div>
      <br />
      <hr />
      <br />
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">login</Link>
          </li>
          <li>
            <Link to="/register">register</Link>
          </li>
          <li>
            <Link to="/dashboard">dashboard</Link>
          </li>
        </ul>
      </div>
      <AppRoutes />
    </div>
  );
}

export default App;
