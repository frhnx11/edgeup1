import { Component, ReactNode } from 'react';

class DashboardErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Dashboard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              Dashboard Loading Error
            </h1>
            <p className="text-gray-700 mb-4">
              There was an error loading the dashboard. This usually happens when:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>A required dependency is missing</li>
              <li>A context provider is not properly set up</li>
              <li>There's an issue with local storage</li>
            </ul>
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
              <p className="font-mono text-sm text-red-800">
                {this.state.error?.message}
              </p>
            </div>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Clear Cache & Return to Login
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy load the actual dashboard
import { lazy, Suspense } from 'react';

const SocialLearnerDashboard = lazy(() =>
  import('./social-learner/student/DashboardPage').then(module => ({
    default: module.DashboardPage
  }))
);

const LoadingDashboard = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg">Loading Dashboard...</p>
    </div>
  </div>
);

export function SafeDashboard() {
  return (
    <DashboardErrorBoundary>
      <Suspense fallback={<LoadingDashboard />}>
        <SocialLearnerDashboard />
      </Suspense>
    </DashboardErrorBoundary>
  );
}
