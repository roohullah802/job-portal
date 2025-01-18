import './App.css'
import Navbar from './components/Navbar.jsx'
import Login from './components/auth/Login.jsx'
import SignUp from './components/auth/SignUp.jsx'
import  Home  from './components/Home.jsx'
import { RouterProvider } from 'react-router-dom'
import {createBrowserRouter} from "react-router-dom"

function App() {


  const router = createBrowserRouter([
    {
      path:"/",
      element: <Home />,
    },
    {
      path:"/login",
      element:<Login />
    },
    {
      path:"/signup",
      element:<SignUp />
    }
  ])

  return (
    <>
      <div >
        <RouterProvider router={router} />
      </div>


    </>
  )
}

export default App
