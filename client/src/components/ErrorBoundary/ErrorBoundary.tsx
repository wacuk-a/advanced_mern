import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console or error reporting service
    console.error('Error Boundary Caught an Error:', error, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: FallbackComponent } = this.props;
      
      if (FallbackComponent && this.state.error) {
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <div className="error-boundary">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h2>Something went wrong</h2>
            <p>We apologize for the inconvenience. Please try refreshing the page.</p>
            
            <details className="error-details">
              <summary>Error Details</summary>
              <pre>{this.state.error?.toString()}</pre>
              <pre>{this.state.errorInfo?.componentStack}</pre>
            </details>
            
            <div className="error-actions">
              <button 
                onClick={this.resetError}
                className="btn-primary"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="btn-secondary"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Default error fallback component
export const ErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({
  error,
  resetError,
}) => {
  return (
    <div className="error-fallback" role="alert">
      <div className="error-fallback-content">
        <h3>Application Error</h3>
        <p>Something went wrong:</p>
        <pre className="error-message">{error.message}</pre>
        <div className="error-fallback-actions">
          <button onClick={resetError} className="btn-primary">
            Try Again
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-secondary"
          >
            Reload Application
          </button>
        </div>
      </div>
    </div>
  );
};
