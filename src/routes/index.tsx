import React, { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const Courses = lazy(() => import('@/views/Courses'))
const Home = lazy(() => import('@/views/Home'))
const Profile = lazy(() => import('@/views/Profile'))
const Column = lazy(() => import('@/views/column'))
const Tutorial = lazy(() => import('@/views/tutorial'))

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/courses',
    element: <Courses />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/tutorial',
    element: <Tutorial />,
  },
  {
    path: '/column',
    element: <Column />,
  },
]

export default routes
