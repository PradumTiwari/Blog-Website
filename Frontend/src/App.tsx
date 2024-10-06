
import './App.css'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'

import Signin from './Components/Signin';
import Signup from './Components/Signup';
import Blog from './Components/Blog';
import Intro from './Components/Intro';


function App() {

  const router=createBrowserRouter([
    {
      path:"/",
      element:<Intro/>,
      children:[
        {
          path:"signup",
          element:<Signup/>,
        }
        ,
        {
          path:"signin",
          element:<Signin/>,
        }
        , {
          path:"Blog",
          element:<Blog/>,
        }
        
      ]
    }
  ])

  return (
    <>
     <RouterProvider router={router}/>
    </>
  )
}

export default App
