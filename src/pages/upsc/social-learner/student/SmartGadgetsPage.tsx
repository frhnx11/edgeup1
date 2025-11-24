import React, { useState } from 'react';
import { WelcomeTooltip } from '../../../../components/upsc/common/WelcomeTooltip';
import {
  Laptop,
  Watch,
  Lightbulb,
  RefreshCw,
  Settings,
  Plus,
  Clock,
  Battery,
  HardDrive,
  Zap,
  Cloud,
  BarChart2,
  TrendingUp,
  Calendar,
  Brain,
  Target
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Device {
  id: string;
  name: string;
  type: 'tablet' | 'watch' | 'lamp';
  model: string;
  status: 'Connected' | 'Disconnected' | 'Active';
  metrics: {
    [key: string]: {
      value: string | number;
      unit?: string;
    };
  };
}

export function SmartGadgetsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('effectiveness');

  const [devices] = useState<Device[]>([
    {
      id: 'tablet-1',
      name: 'Study Tablet',
      type: 'tablet',
      model: 'iPad Pro 12.9"',
      status: 'Connected',
      metrics: {
        storage: {
          value: 45.2,
          unit: 'GB'
        },
        battery: {
          value: 85,
          unit: '%'
        }
      }
    },
    {
      id: 'watch-1',
      name: 'Study Watch',
      type: 'watch',
      model: 'Focus Timer Pro',
      status: 'Connected',
      metrics: {
        studyTime: {
          value: 6.5,
          unit: 'hrs'
        },
        battery: {
          value: 92,
          unit: '%'
        }
      }
    },
    {
      id: 'lamp-1',
      name: 'Study Lamp',
      type: 'lamp',
      model: 'Smart LED',
      status: 'Active',
      metrics: {
        brightness: {
          value: 75,
          unit: '%'
        },
        temperature: {
          value: 4600,
          unit: 'K'
        }
      }
    }
  ]);

  const syncStatus = [
    {
      name: 'Study Timer',
      status: 'Last synced: 2 mins ago',
      icon: Clock
    },
    {
      name: 'Notes',
      status: 'Syncing in progress...',
      icon: HardDrive
    },
    {
      name: 'Progress Data',
      status: 'Up to date',
      icon: BarChart2
    },
    {
      name: 'Cloud Backup',
      status: 'Last backup: Today 3:30 PM',
      icon: Cloud
    }
  ];

  // Device usage data
  const deviceUsageData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tablet Usage',
        data: [6.2, 7.1, 5.3, 8.2, 7.5, 4.2, 6.4],
        backgroundColor: 'rgba(79, 70, 229, 1)',
        borderRadius: 4
      },
      {
        label: 'Watch Usage',
        data: [4.5, 5.2, 4.8, 6.1, 5.5, 3.8, 4.9],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderRadius: 4
      },
      {
        label: 'Smart Lamp',
        data: [8.5, 9.2, 7.8, 10.1, 9.5, 6.8, 8.9],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderRadius: 4
      }
    ]
  };

  // Study effectiveness data
  const studyEffectivenessData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Focus Score',
        data: [85, 88, 82, 90, 87, 80, 86],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Productivity',
        data: [78, 82, 76, 85, 80, 75, 79],
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'tablet':
        return Laptop;
      case 'watch':
        return Watch;
      case 'lamp':
        return Lightbulb;
      default:
        return Laptop;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected':
        return 'text-[#10ac8b] bg-[#10ac8b]/10';
      case 'Active':
        return 'text-[#10ac8b] bg-[#10ac8b]/10';
      default:
        return 'text-[#094d88] bg-[#094d88]/10';
    }
  };

  return (
      <div className="space-y-6">
        <WelcomeTooltip message="Explore AI-powered tools to enhance your learning." />

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Smart Gadgets</h1>
            <p className="text-gray-600">Manage your connected study devices</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#094d88] text-white rounded-lg hover:bg-[#10ac8b] transition-colors">
            <Plus className="w-4 h-4" />
            Add Device
          </button>
        </div>

        {/* Devices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {devices.map(device => (
            <div key={device.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#094d88]/10 text-[#094d88] rounded-lg flex items-center justify-center">
                    {React.createElement(getDeviceIcon(device.type), { className: 'w-6 h-6' })}
                  </div>
                  <div>
                    <h3 className="font-medium">{device.name}</h3>
                    <p className="text-sm text-gray-600">{device.model}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                  {device.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.entries(device.metrics).map(([key, metric]) => (
                  <div key={key} className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 capitalize">{key}</div>
                    <div className="font-medium">
                      {metric.value}
                      {metric.unit && <span className="text-gray-500 text-sm">{metric.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#094d88]/10 text-[#094d88] rounded-lg hover:bg-[#094d88]/20 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  <span>Sync Now</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sync Status */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Sync Status</h2>
              <button className="flex items-center gap-2 text-[#094d88] hover:text-[#10ac8b]">
                <RefreshCw className="w-4 h-4" />
                Sync All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {syncStatus.map((item, index) => (
              <div key={index} className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-[#094d88]/10 text-[#094d88] rounded-lg flex items-center justify-center">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-medium">{item.name}</h3>
                </div>
                <p className="text-sm text-gray-600">{item.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Usage Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Device Usage</h2>
              <select 
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="3months">Last 3 Months</option>
              </select>
            </div>
            <div className="h-64">
              <Bar
                data={deviceUsageData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      stacked: true,
                      grid: {
                        display: false
                      }
                    },
                    y: {
                      stacked: true,
                      beginAtZero: true,
                      max: 30,
                      title: {
                        display: true,
                        text: 'Hours'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'top' as const
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Study Effectiveness Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Study Effectiveness</h2>
              <select 
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="effectiveness">Focus & Productivity</option>
                <option value="retention">Learning Retention</option>
                <option value="engagement">Study Engagement</option>
              </select>
            </div>
            <div className="h-64">
              <Line
                data={studyEffectivenessData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: {
                        display: true,
                        text: 'Score'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'top' as const
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
  );
}