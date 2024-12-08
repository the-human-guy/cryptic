const { BrowserRouter, Routes, Route } = ReactRouterDOM

import { HomePage } from './pages/home.jsx'
import { Header } from './components/header/menu.jsx'

const BASE_URL = location.pathname

export const App = () => {
  return (
    <BrowserRouter basename={BASE_URL}>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}
