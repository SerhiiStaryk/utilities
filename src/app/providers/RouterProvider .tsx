import { FC } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../routes/router';

const AppRouterProvider: FC = () => <RouterProvider router={router} />;

export default AppRouterProvider;
