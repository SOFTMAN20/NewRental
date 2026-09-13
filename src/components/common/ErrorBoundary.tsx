/**
 * ERROR BOUNDARY COMPONENT
 * ========================
 * Catches React errors and shows friendly error UI
 * Handles app crashes gracefully
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  isOnline: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isOnline: navigator.onLine,
    };
  }

  componentDidMount() {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  handleOnline = () => {
    this.setState({ isOnline: true });
    
    // Auto-retry if error occurred due to network issue
    if (this.state.hasError && this.state.retryCount < 3) {
      console.log('🌐 Network restored. Auto-retrying...');
      setTimeout(() => {
        this.handleAutoRetry();
      }, 1000);
    }
  };

  handleOffline = () => {
    this.setState({ isOnline: false });
  };

  handleAutoRetry = () => {
    this.setState((prevState) => ({
      retryCount: prevState.retryCount + 1,
    }));
    
    console.log(`🔄 Auto-retry attempt ${this.state.retryCount + 1}/3`);
    window.location.reload();
  };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('❌ Error Boundary caught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Check if it's a network-related error
    const isNetworkError = 
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('Failed to load') ||
      !navigator.onLine;

    // Auto-retry on network errors (max 3 times)
    if (isNetworkError && this.state.retryCount < 3) {
      console.log('🌐 Network error detected. Auto-retrying in 3 seconds...');
      setTimeout(() => {
        this.handleAutoRetry();
      }, 3000);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    });
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-safari-50 via-white to-kilimanjaro-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Error Icon */}
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {!this.state.isOnline ? '📡 Hakuna Mtandao' : 'Oops! Kuna Hitilafu'}
            </h1>
            <p className="text-gray-600 mb-6">
              {!this.state.isOnline 
                ? 'Unganisha mtandao. Tutajaribu tena mara tu mtandao utakapopatikana.'
                : this.state.retryCount > 0 
                  ? `Tunajaribu tena... (${this.state.retryCount}/3)`
                  : 'Samahani, kuna tatizo lililotokea. Tafadhali jaribu tena.'
              }
            </p>

            {/* Error Details (Dev only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left bg-gray-50 rounded-lg p-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                  Technical Details (Dev Only)
                </summary>
                <pre className="text-xs text-red-600 overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.errorInfo && (
                    <>
                      {'\n\n'}
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={this.handleReset}
                className="w-full"
                size="lg"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Jaribu Tena
              </Button>
              
              <Button
                onClick={this.handleGoHome}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Home className="h-4 w-4 mr-2" />
                Rudi Nyumbani
              </Button>
            </div>

            {/* Help Text */}
            <p className="mt-6 text-sm text-gray-500">
              Kama tatizo linaendelea, wasiliana nasi:
              <br />
              <a href="tel:+255750939217" className="text-primary hover:underline">
                0750 939 217
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
