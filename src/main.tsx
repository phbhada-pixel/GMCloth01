import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import AuthProvider from './components/AuthProvider'
import './index.css'

const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ApprovalGuard = lazy(() => import('./components/ApprovalGuard'));

const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={
              <ApprovalGuard>
                <Dashboard />
              </ApprovalGuard>
            } />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
)