import React, { Component } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled screen error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center p-6 bg-[#0A0E14] text-primary">
          <div className="max-w-md w-full mission-panel p-6 border-red/40 bg-[#111823] flex flex-col gap-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-red/10 border border-red/30 flex items-center justify-center text-red">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono text-red tracking-wider uppercase mb-1">
                SYSTEM TELEMETRY FAULT // SUBSYSTEM ERROR
              </div>
              <h2 className="text-lg font-bold font-display text-white">
                Screen Rendering Interrupted
              </h2>
              <p className="text-xs font-mono text-secondary mt-2 break-words">
                {this.state.error?.message || 'An unexpected rendering anomaly occurred in the mission screen.'}
              </p>
            </div>
            <button
              onClick={this.handleReset}
              className="btn-mission w-full mt-2 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RELOAD SUBSYSTEM</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
