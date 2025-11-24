import { useState } from 'react';
import { AdminLayout } from '../../../../layouts/AdminLayout';
import {
  Brain,
  Settings,
  Sliders,
  MessageSquare,
  Mic,
  Volume2,
  Zap,
  Save,
  RefreshCw,
  ChevronRight,
  AlertCircle,
  Check } from 'lucide-react';

interface AIModel {
  id: string;
  name: string;
  type: 'chat' | 'speech' | 'vision';
  status: 'active' | 'disabled';
  version: string;
  lastUpdated: string;
  performance: number;
  usage: {
    requests: number;
    tokens: number;
    cost: number;
  };
}

interface AISettings {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  responseLength: 'short' | 'medium' | 'long';
  language: string;
}

export function AISettingsPage() {
  const [settings, setSettings] = useState<AISettings>({
    temperature: 0.7,
    maxTokens: 2000,
    topP: 0.9,
    frequencyPenalty: 0.5,
    presencePenalty: 0.5,
    responseLength: 'medium',
    language: 'en'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const models: AIModel[] = [
    {
      id: 'gpt-4',
      name: 'GPT-4 Turbo',
      type: 'chat',
      status: 'active',
      version: '1.0',
      lastUpdated: '2025-02-01',
      performance: 95,
      usage: {
        requests: 15243,
        tokens: 1245000,
        cost: 245.50
      }
    },
    {
      id: 'whisper-2',
      name: 'Whisper v2',
      type: 'speech',
      status: 'active',
      version: '2.0',
      lastUpdated: '2025-01-15',
      performance: 92,
      usage: {
        requests: 5243,
        tokens: 524000,
        cost: 105.20
      }
    }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Settings</h1>
            <p className="text-[#094d88]">Configure AI models and behavior</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowResetModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset to Default
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-[#094d88] text-white rounded-lg hover:bg-[#10ac8b] transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {models.map(model => (
            <div key={model.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      model.type === 'chat' ? 'bg-blue-50 text-blue-600' :
                      model.type === 'speech' ? 'bg-green-50 text-green-600' :
                      'bg-[#094d88]/10 text-[#094d88]'
                    }`}>
                      {model.type === 'chat' ? (
                        <MessageSquare className="w-6 h-6" />
                      ) : model.type === 'speech' ? (
                        <Mic className="w-6 h-6" />
                      ) : (
                        <Brain className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{model.name}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600">v{model.version}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          model.status === 'active' ? 'bg-[#10ac8b]/10 text-[#10ac8b]' : 'bg-[#094d88]/10 text-[#094d88]'
                        }`}>
                          {model.status === 'active' ? (
                            <Check className="w-3 h-3 mr-1" />
                          ) : (
                            <AlertCircle className="w-3 h-3 mr-1" />
                          )}
                          {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Performance</span>
                    <span className="font-medium">{model.performance}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-[#094d88] rounded-full"
                      style={{ width: `${model.performance}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Requests</div>
                    <div className="font-medium">{model.usage.requests.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Tokens</div>
                    <div className="font-medium">{model.usage.tokens.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Cost</div>
                    <div className="font-medium">${model.usage.cost.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Settings Form */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Model Configuration</h2>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temperature
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => setSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>More Focused (0.0)</span>
                <span>More Creative (1.0)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Tokens
              </label>
              <input
                type="number"
                value={settings.maxTokens}
                onChange={(e) => setSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Response Length
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['short', 'medium', 'long'].map(length => (
                  <button
                    key={length}
                    onClick={() => setSettings(prev => ({ ...prev, responseLength: length as any }))}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      settings.responseLength === length
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-gray-200 hover:border-indigo-200'
                    }`}
                  >
                    {length.charAt(0).toUpperCase() + length.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
                <option value="ml">Malayalam</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency Penalty
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.frequencyPenalty}
                  onChange={(e) => setSettings(prev => ({ ...prev, frequencyPenalty: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Presence Penalty
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.presencePenalty}
                  onChange={(e) => setSettings(prev => ({ ...prev, presencePenalty: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Reset Settings</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to reset all AI settings to their default values? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSettings({
                    temperature: 0.7,
                    maxTokens: 2000,
                    topP: 0.9,
                    frequencyPenalty: 0.5,
                    presencePenalty: 0.5,
                    responseLength: 'medium',
                    language: 'en'
                  });
                  setShowResetModal(false);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}