import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import { Footer, Header } from '../../../components'
import LoadingPage from '../../loading'

function WithHeaderWithFooter() {
  return (
    <>
      <Header></Header>
      <Suspense fallback={<LoadingPage height="100vh" />}>
        <Outlet />
      </Suspense>
      <Footer status={true}></Footer>
    </>
  )
}

export default WithHeaderWithFooter
