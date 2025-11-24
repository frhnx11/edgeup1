import React, { useState } from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { APIStatus } from '../../../../components/upsc/common/APIStatus';
import { getClaudeChatResponse, generateClaudeFAQs } from '../../../../utils/claude';
import { getChatResponse, getOpenAIResponse } from '../../../../utils/openai';
import { motion } from 'framer-motion';
import { Send, Loader, CheckCircle } from 'lucide-react';

export function APITestPage() {
  const [testMessage, setTestMessage] = useState('Explain quantum physics in simple terms');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [testType, setTestType] = useState<'claude' | 'openai' | 'faq'>('openai');

  const runTest = async () => {
    if (!testMessage.trim()) return;
    
    setIsLoading(true);
    setResponse('');
    
    try {
      let result = '';
      
      switch (testType) {
        case 'claude':
          result = await getClaudeChatResponse(
            [{ role: 'user', content: testMessage }],
            'Physics',
            'Quantum Mechanics'
          );
          break;
          
        case 'openai':
          result = await getChatResponse(
            [{ role: 'user', content: testMessage }],
            'Physics',
            'Quantum Mechanics'
          );
          break;
          
        case 'faq':
          const faqs = await generateClaudeFAQs('Physics', 'Quantum Mechanics');
          result = `Generated ${faqs.length} FAQs:\n\n` + 
                  faqs.map((faq, i) => `${i+1}. ${faq.question}\n   ${faq.answer.substring(0, 200)}...`).join('\n\n');
          break;
          
        default:
          result = 'Invalid test type';
      }
      
      setResponse(result);
    } catch (error) {
      console.error('Test failed:', error);
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Testing Center</h1>
          <p className="text-gray-600 mt-2">Test your AI integrations and verify API connectivity</p>
        </div>

        {/* API Status */}
        <APIStatus />

        {/* Test Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Run API Test</h2>
          
          <div className="space-y-4">
            {/* Test Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Type</label>
              <div className="flex gap-3">
                {[
                  { key: 'openai', label: 'OpenAI Chat' },
                  { key: 'claude', label: 'Claude (via OpenAI)' },
                  { key: 'faq', label: 'FAQ Generation' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setTestType(key as any)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      testType === key
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Message Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Message</label>
              <textarea
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Enter your test message..."
              />
            </div>

            {/* Run Test Button */}
            <button
              onClick={runTest}
              disabled={isLoading || !testMessage.trim()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                isLoading || !testMessage.trim()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Run Test
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Test Results */}
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h2 className="text-xl font-semibold">Test Results</h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                {response}
              </pre>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">How to use:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Check the API Status panel above to verify your integrations</li>
            <li>• Select a test type and enter a message</li>
            <li>• Click "Run Test" to verify AI functionality</li>
            <li>• Real responses indicate full API integration</li>
            <li>• Demo responses indicate fallback mode (add API keys)</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}