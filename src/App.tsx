import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import './App.scss'
import LoadingPage from './pages/loading'
import routes from './routes'

function App() {
  const Views = () => useRoutes(routes)

  return (
    <Suspense fallback={<LoadingPage />}>
      <Views />
    </Suspense>
  )
}

export default App
