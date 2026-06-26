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
      <div className="mx-auto flex max-w-prose items-center justify-between px-4 py-4">
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

function Landing() {
  const { user } = useAuth();
  return (
    <main className="mx-auto max-w-prose px-4 py-10">
      <Disclaimer variant="banner" />
      <h1 className="mt-8 text-3xl font-bold text-navy">
        New York Housing Court documents, in plain English.
      </h1>
      <p className="mt-4 text-gray-700">
        PlainRights Court helps landlords and tenants prepare New York State
        landlord-tenant court documents — predicate notices, petitions, answers,
        and motions — with step-by-step guidance, deadline calculators, and filing
        instructions. You stay in control; we prepare the paperwork.
      </p>

      <div className="mt-8">
        <Link
          to={user ? '/dashboard' : '/login'}
          className="inline-block rounded-md bg-accent px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          {user ? 'Go to your dashboard' : 'Get started — create a free account'}
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-5">
          <h2 className="font-semibold text-navy">I am a landlord / owner</h2>
          <p className="mt-1 text-sm text-gray-600">
            Rent demands, holdover notices, petitions, affidavits of service.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-5">
          <h2 className="font-semibold text-navy">I am a tenant / occupant</h2>
          <p className="mt-1 text-sm text-gray-600">
            Answers, defenses, orders to show cause, repair (HP) actions.
          </p>
        </div>
      </div>
    </main>
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
