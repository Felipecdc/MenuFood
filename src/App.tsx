
import { createBrowserRouter } from 'react-router-dom';

import { Layout } from './components/layout';
import { Private } from './route';

import { Menu } from './pages/menu';
import { Dashboard } from './pages/dashboard';
import { Login } from './pages/login';

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {
        path: "/",
        element: <Menu/> 
      },
      {
        path: "/dashboard",
        element: <Private><Dashboard/></Private>
      },
      {
        path: "/login",
        element: <Login/>
      }
    ]
  }
])



export { router }