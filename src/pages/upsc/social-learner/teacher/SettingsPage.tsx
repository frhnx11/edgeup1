import { useState } from 'react';
import { AdminLayout } from '../../../../layouts/AdminLayout';
import {
  Settings,
  Bell,
  Mail,
  Globe,
  Shield,
  Database,
  Cloud,
  Save,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface SystemSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
  };
  localization: {
    timezone: string;
    dateFormat: string;
    language: string;
  };
  backup: {
    automatic: boolean;
    frequency: string;
    retention: number;
  };
}

export function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    security: {
      twoFactor: true,
      sessionTimeout: 30,
      passwordExpiry: 90
    },
    localization: {
      timezone: 'Asia/Kolkata',
      dateFormat: 'DD/MM/YYYY',
      language: 'en'
    },
    backup: {
      automatic: true,
      frequency: 'daily',
      retention: 30
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

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
            <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
            <p className="text-[#094d88]">Configure system-wide preferences</p>
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

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold">Notifications</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-gray-600">Receive updates via email</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        email: e.target.checked
                      }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#094d88]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#094d88]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Push Notifications</div>
                  <div className="text-sm text-gray-600">Receive in-app notifications</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        push: e.target.checked
                      }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#094d88]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#094d88]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">SMS Notifications</div>
                  <div className="text-sm text-gray-600">Receive updates via SMS</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.sms}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        sms: e.target.checked
                      }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#094d88]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#094d88]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold">Security</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-600">Enable 2FA for added security</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.security.twoFactor}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      security: {
                        ...prev.security,
                        twoFactor: e.target.checked
                      }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#094d88]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#094d88]"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Timeout (minutes)
                </label>
                <input
                  type=" number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    security: {
                      ...prev.security,
                      sessionTimeout: parseInt(e.target.value)
                    }
                  }))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#094d88] focus:ring focus:ring-[#094d88]/20 focus:ring-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password Expiry (days)
                </label>
                <input
                  type="number"
                  value={settings.security.passwordExpiry}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    security: {
                      ...prev.security,
                      passwordExpiry: parseInt(e.target.value)
                    }
                  }))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#094d88] focus:ring focus:ring-[#094d88]/20 focus:ring-opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Localization */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold">Localization</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select
                  value={settings.localization.timezone}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    localization: {
                      ...prev.localization,
                      timezone: e.target.value
                    }
                  }))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#094d88] focus:ring focus:ring-[#094d88]/20 focus:ring-opacity-50"
                >
                  <option value="Asia/Kolkata">India (GMT+5:30)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">New York (GMT-4)</option>
                  <option value="Europe/London">London (GMT+1)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Format
                </label>
                <select
                  value={settings.localization.dateFormat}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    localization: {
                      ...prev.localization,
                      dateFormat: e.target.value
                    }
                  }))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#094d88] focus:ring focus:ring-[#094d88]/20 focus:ring-opacity-50"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  value={settings.localization.language}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    localization: {
                      ...prev.localization,
                      language: e.target.value
                    }
                  }))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#094d88] focus:ring focus:ring-[#094d88]/20 focus:ring-opacity-50"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                  <option value="ml">Malayalam</option>
                </select>
              </div>
            </div>
          </div>

          {/* Backup & Storage */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold">Backup & Storage</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Automatic Backup</div>
                  <div className="text-sm text-gray-600">Enable automated backups</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.backup.automatic}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      backup: {
                        ...prev.backup,
                        automatic: e.target.checked
                      }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#094d88]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#094d88]"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Backup Frequency
                </label>
                <select
                  value={settings.backup.frequency}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    backup: {
                      ...prev.backup,
                      frequency: e.target.value
                    }
                  }))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#094d88] focus:ring focus:ring-[#094d88]/20 focus:ring-opacity-50"
                >
                  <option value="hourly">Every Hour</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Retention Period (days)
                </label>
                <input
                  type="number"
                  value={settings.backup.retention}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    backup: {
                      ...prev.backup,
                      retention: parseInt(e.target.value)
                    }
                  }))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#094d88] focus:ring focus:ring-[#094d88]/20 focus:ring-opacity-50"
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
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold">Reset Settings</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to reset all settings to their default values? This action cannot be undone.
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
                  // Reset settings to default
                  setShowResetModal(false);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reset All Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}