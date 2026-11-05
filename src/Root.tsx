import { StrictMode } from 'react';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';

/** The whole tree, shared by the client entry and the prerender so both render the same thing. */
export default function Root() {
  return (
    <StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </StrictMode>
  );
}
