import { Suspense, lazy } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { APP_NAME, OPERATOR_NAME } from './lib/constants.js';
import { useAuth } from './lib/AuthContext.jsx';
import Disclaimer from './components/Disclaimer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import LawUpdates from './pages/LawUpdates.jsx';
import Courts from './pages/Courts.jsx';
import Pricing from './pages/Pricing.jsx';
import Account from './pages/Account.jsx';
import Landing from './pages/Landing.jsx';
import IntakeWizard from './intake/IntakeWizard.jsx';

// Code-split the document generator: it pulls in the heavy React-PDF renderer,
// which should only load when a user actually opens a document.
const DocumentGenerator = lazy(() => import('./documents/DocumentGenerator.jsx'));
const DocumentPaid = lazy(() => import('./documents/DocumentPaid.jsx'));

function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  async function handleSignOut() {
    await signOut();
    navigate('/');
  }
  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-bold text-navy">
          {APP_NAME}
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link to="/dashboard" className="text-navy hover:text-accent">
                Dashboard
              </Link>
              <Link to="/profile" className="text-navy hover:text-accent">
                Profile
              </Link>
              <Link to="/courts" className="text-navy hover:text-accent">
                Courts
              </Link>
              <Link to="/account" className="text-navy hover:text-accent">
                Account
              </Link>
              <Link to="/law-updates" className="text-navy hover:text-accent">
                Law updates
              </Link>
              {isAdmin && (
                <Link to="/admin" className="font-medium text-accent hover:underline">
                  Admin
                </Link>
              )}
              <button onClick={handleSignOut} className="text-gray-500 hover:text-accent">
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className="text-navy hover:text-accent">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200">
      <div className="mx-auto max-w-prose space-y-3 px-4 py-6">
        <Disclaimer variant="footer" />
        <p className="text-xs text-gray-400">
          © {OPERATOR_NAME}. A document preparation &amp; legal education service. Not a law firm.
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/law-updates"
            element={
              <ProtectedRoute>
                <LawUpdates />
              </ProtectedRoute>
            }
          />
          <Route path="/courts" element={<Courts />} />          {/* public */}
          <Route
            path="/pricing"
            element={
              <ProtectedRoute>
                <Pricing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/start"
            element={
              <ProtectedRoute>
                <IntakeWizard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/document/:docType"
            element={
              <ProtectedRoute>
                <Suspense
                  fallback={
                    <p className="mx-auto max-w-prose px-4 py-16 text-gray-500">
                      Loading document builder…
                    </p>
                  }
                >
                  <DocumentGenerator />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/document-paid"
            element={
              <ProtectedRoute>
                <Suspense
                  fallback={
                    <p className="mx-auto max-w-prose px-4 py-16 text-gray-500">
                      Loading…
                    </p>
                  }
                >
                  <DocumentPaid />
                </Suspense>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
