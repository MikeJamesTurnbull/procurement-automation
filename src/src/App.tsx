import { Routes, Route } from 'react-router-dom'
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import RequestForm from './pages/RequestForm'
import RequestDetails from './pages/RequestDetails'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <>
      <AuthenticatedTemplate>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/requests/new" element={<RequestForm />} />
            <Route path="/requests/:id" element={<RequestDetails />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Layout>
      </AuthenticatedTemplate>
      
      <UnauthenticatedTemplate>
        <Login />
      </UnauthenticatedTemplate>
    </>
  )
}

export default App
