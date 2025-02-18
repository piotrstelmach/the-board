import { useRefreshToken } from '../hooks/useRefreshToken';
import { Layout } from '../components/layout';
import { AppRoutes } from './router';

export function App() {
  useRefreshToken();

  return (
    <>
      <Layout />
      <AppRoutes />
    </>
  );
}

export default App;
