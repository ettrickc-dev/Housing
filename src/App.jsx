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
import EFileGuide from './pages/EFileGuide.jsx';
import LegalPage from './pages/LegalPage.jsx';
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
          {user ? (
            <>
              <Link to="/dashboard" className="text-navy hover:text-accent">
                Dashboard
              </Link>
              <Link to="/profile" className="hidden text-navy hover:text-accent sm:inline">
                Profile
              </Link>
              <Link to="/account" className="hidden text-navy hover:text-accent sm:inline">
                Account
              </Link>
              <Link to="/courts" className="hidden text-navy hover:text-accent sm:inline">
                Courts
              </Link>
              <Link to="/law-updates" className="hidden text-navy hover:text-accent sm:inline">
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
            <>
              {/* First-time visitors: only the essentials */}
              <Link to="/start" className="text-navy hover:text-accent">
                Document Production
              </Link>
              <Link to="/guides" className="hidden text-navy hover:text-accent sm:inline">
                Guides
              </Link>
              <Link to="/pricing" className="text-navy hover:text-accent">
                Pricing
              </Link>
              <Link to="/login" className="font-medium text-accent hover:underline">
                Sign In
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  const cols = [
    { h: 'Get started', links: [['Start free', '/start'], ['Pricing', '/pricing'], ['File online (NYSCEF)', '/efile']] },
    { h: 'Learn', links: [['Forms', '/forms'], ['Guides', '/guides'], ['Court directory', '/courts']] },
    { h: 'Legal', links: [['Terms of Service', '/terms'], ['Privacy Policy', '/privacy'], ['Refund Policy', '/refunds']] },
  ];
  return (
    <footer className="mt-16 border-t border-gray-200 bg-panel">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-4">
          <div>
            <div className="text-lg font-bold text-navy">{APP_NAME}</div>
            <p className="mt-2 text-sm text-gray-600">
              Plain-English New York Housing Court document preparation.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <div className="text-sm font-semibold text-navy">{c.h}</div>
              <ul className="mt-2 space-y-1.5">
                {c.links.map(([label, to]) => (
                  <li key={to}>
                    <Link to={to} className="text-sm text-gray-600 hover:text-accent">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6">
          <Disclaimer variant="footer" />
          <p className="mt-3 text-xs text-gray-400">
            © {OPERATOR_NAME}. A document preparation &amp; legal education service. Not a law firm,
            and not affiliated with any court or government agency.
          </p>
        </div>
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
          <Route path="/efile" element={<EFileGuide />} />          {/* public SEO */}
          <Route path="/terms" element={<LegalPage slug="terms" />} />
          <Route path="/privacy" element={<LegalPage slug="privacy" />} />
          <Route path="/refunds" element={<LegalPage slug="refunds" />} />
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
