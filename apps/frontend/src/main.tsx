import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { AuthorizationProvider } from './stores/context/authorization/authorizationContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <BrowserRouter>
      <AuthorizationProvider>
        <App />
      </AuthorizationProvider>
    </BrowserRouter>
  </StrictMode>
);
