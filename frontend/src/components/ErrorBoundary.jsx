import React from "react";
import { AlertTriangle } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
          <AlertTriangle className="text-yellow-500 w-16 h-16 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <div className="bg-gray-800 p-4 rounded-lg mb-4 max-w-xl w-full overflow-auto">
            <p className="text-red-400 mb-2">
              {this.state.error && this.state.error.toString()}
            </p>
            <details className="mt-4">
              <summary className="text-blue-400 cursor-pointer">
                View technical details
              </summary>
              <pre className="text-xs text-gray-400 mt-2 p-2 bg-gray-900 rounded overflow-auto">
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
