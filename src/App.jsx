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
import LawUpdates from './pages/LawUpdates.jsx';
import Courts from './pages/Courts.jsx';
import Pricing from './pages/Pricing.jsx';
import Account from './pages/Account.jsx';
import Landing from './pages/Landing.jsx';
import FormsIndex from './pages/FormsIndex.jsx';
import FormLanding from './pages/FormLanding.jsx';
import GuidesIndex from './pages/GuidesIndex.jsx';
import GuideLanding from './pages/GuideLanding.jsx';
import IntakeWizard from './intake/IntakeWizard.jsx';

// Code-split the document generator: it pulls in the heavy React-PDF renderer,
// which should only load when a user actually opens a document.
const DocumentGenerator = lazy(() => import('./documents/DocumentGenerator.jsx'));
const DocumentPaid = lazy(() => import('./documents/DocumentPaid.jsx'));
// Lazy so the admin's registry/React-PDF imports stay out of the main bundle.
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));

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
          <Link to="/forms" className="hidden text-navy hover:text-accent sm:inline">
            Forms
          </Link>
          <Link to="/guides" className="hidden text-navy hover:text-accent sm:inline">
            Guides
          </Link>
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
          <Route path="/forms" element={<FormsIndex />} />       {/* public SEO */}
          <Route path="/forms/:slug" element={<FormLanding />} /> {/* public SEO */}
          <Route path="/guides" element={<GuidesIndex />} />       {/* public SEO */}
          <Route path="/guides/:slug" element={<GuideLanding />} /> {/* public SEO */}
          <Route path="/pricing" element={<Pricing />} />   {/* public */}
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
                  <Suspense fallback={<p className="mx-auto max-w-prose px-4 py-16 text-gray-500">Loading…</p>}>
                    <AdminDashboard />
                  </Suspense>
                </AdminRoute>
              </ProtectedRoute>
            }
          />
          {/* Public funnel — build & preview before signing up */}
          <Route path="/start" element={<IntakeWizard />} />
          <Route
            path="/document/:docType"
            element={
              <Suspense
                fallback={
                  <p className="mx-auto max-w-prose px-4 py-16 text-gray-500">
                    Loading document builder…
                  </p>
                }
              >
                <DocumentGenerator />
              </Suspense>
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
