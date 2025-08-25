import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import Home from './routes/Home.jsx'
import Dashboard from './routes/Dashboard.jsx'
import Error from './routes/Error.jsx'
import './index.css'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const router = createBrowserRouter([
  {
    path:'/', element:<App/>,
    errorElement:<Error/>,

    children:[
      {path:'/', element:<Home/>},
      {path:'/dashboard', element:(
        <ProtectedRoute>
          <Dashboard/>
        </ProtectedRoute>
      )},
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router = {router}/>
  </StrictMode>,
)
