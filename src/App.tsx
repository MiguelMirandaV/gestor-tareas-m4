import { Navigate, Route, Routes } from 'react-router'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { TasksPage } from './pages/TasksPage'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { PublicOnlyRoute } from './routes/PublicOnlyRoute'
import './App.css'

function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/tasks" element={<TasksPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/tasks" replace />} />
    </Routes>
  )
}

export default App
