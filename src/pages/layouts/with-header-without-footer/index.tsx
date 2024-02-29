import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import { Header } from '../../../components'
import LoadingPage from '../../loading'

function WithHeaderWithoutFooter() {
  return (
    <>
      <Header></Header>
      <Suspense fallback={<LoadingPage height="100vh" />}>
        <Outlet />
      </Suspense>
    </>
  )
}

export default WithHeaderWithoutFooter
