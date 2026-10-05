import { MainContextProvider } from './hooks/useMainContext'
import { Viewer3D } from './components/Viewer3D/Viewer3D'
import { Header } from './components/UI/Header'
import { Sidebar } from './components/UI/Sidebar'
import './App.css'

function App() {
  return (
    <MainContextProvider>
      <div className="app-container">
        <Header />
        <div className="body-container">
          <Sidebar />
          <div className="main-area bg-gradient">
            <Viewer3D />
          </div>
        </div>
      </div>
    </MainContextProvider>
  )
}

export default App
