import React from 'react';
import { RouterProvider } from 'react-router-dom';
import appRouter from './router';
import { UserProvider } from './contexts';

const App: React.FC = () => {
  return (
    <UserProvider>
      <RouterProvider router={appRouter} />
    </UserProvider>
  );
};

export default App;