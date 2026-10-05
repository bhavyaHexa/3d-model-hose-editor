import { MainContextProvider } from './hooks/useMainContext'
import { Viewer3D } from './components/Viewer3D/Viewer3D'
import { Header } from './components/UI/Header'
import { Sidebar } from './components/UI/Sidebar'
import { FeedbackButtons } from './components/Feedback/FeedbackButtons'
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
            <div className="feedback-buttons-container">
              <FeedbackButtons />
            </div>
          </div>
        </div>
      </div>
    </MainContextProvider>
  )
}

export default App
