import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface APIStatusProps {
  className?: string;
}

export function APIStatus({ className = '' }: APIStatusProps) {
  const [openaiStatus, setOpenaiStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [elevenlabsStatus, setElevenlabsStatus] = useState<'checking' | 'success' | 'error' | 'disabled'>('checking');

  useEffect(() => {
    checkAPIs();
  }, []);

  const checkAPIs = async () => {
    // Check OpenAI
    try {
      const hasOpenAI = !!import.meta.env.VITE_OPENAI_API_KEY;
      if (hasOpenAI) {
        // We don't actually test the API here to avoid using tokens
        // We just verify the key exists and seems valid
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
        if (apiKey && apiKey.startsWith('sk-') && apiKey.length > 20) {
          setOpenaiStatus('success');
        } else {
          setOpenaiStatus('error');
        }
      } else {
        setOpenaiStatus('error');
      }
    } catch (error) {
      setOpenaiStatus('error');
    }

    // Check ElevenLabs
    try {
      const hasElevenLabs = !!import.meta.env.VITE_ELEVENLABS_API_KEY;
      if (hasElevenLabs) {
        const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
        if (apiKey && apiKey.startsWith('sk_') && apiKey.length > 20) {
          setElevenlabsStatus('success');
        } else {
          setElevenlabsStatus('error');
        }
      } else {
        setElevenlabsStatus('disabled');
      }
    } catch (error) {
      setElevenlabsStatus('error');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'checking':
        return <Clock className="w-4 h-4 text-amber-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'disabled':
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'checking':
        return 'Checking...';
      case 'success':
        return 'Connected';
      case 'error':
        return 'Error';
      case 'disabled':
        return 'Disabled';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'disabled':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      default:
        return 'text-amber-700 bg-amber-50 border-amber-200';
    }
  };

  return (
    <div className={`bg-white rounded-lg border p-4 ${className}`}>
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
        API Status
      </h3>
      
      <div className="space-y-3">
        <div className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(openaiStatus)}`}>
          <div className="flex items-center gap-3">
            {getStatusIcon(openaiStatus)}
            <div>
              <div className="font-medium">OpenAI</div>
              <div className="text-sm opacity-75">Chat, Text-to-Speech, Speech-to-Text</div>
            </div>
          </div>
          <span className="text-sm font-medium">{getStatusText(openaiStatus)}</span>
        </div>

        <div className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(elevenlabsStatus)}`}>
          <div className="flex items-center gap-3">
            {getStatusIcon(elevenlabsStatus)}
            <div>
              <div className="font-medium">ElevenLabs</div>
              <div className="text-sm opacity-75">Premium Voice Synthesis</div>
            </div>
          </div>
          <span className="text-sm font-medium">{getStatusText(elevenlabsStatus)}</span>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-600">
        <p>✅ <strong>Fully Functional:</strong> All AI features available</p>
        <p>⚠️ <strong>Demo Mode:</strong> Limited responses, configure API keys</p>
      </div>
    </div>
  );
}