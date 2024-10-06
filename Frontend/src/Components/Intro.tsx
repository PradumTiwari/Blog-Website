import React from 'react'
import { Outlet } from 'react-router-dom'

const Intro = () => {
  return (
    <div className='m-52 text-2xl'>Made By Pradum
    <div>The new component will be</div>
    <Outlet/>
    </div>
  )
}

export default Intro