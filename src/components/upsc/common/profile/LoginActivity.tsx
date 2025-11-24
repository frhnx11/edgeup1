import { useState, useEffect } from 'react';
import { Clock, Map, Monitor, Smartphone } from 'lucide-react';

interface LoginActivityProps {
  userId: string;
}

interface LoginSession {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  timestamp: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  current: boolean;
}

export function LoginActivity({ userId }: LoginActivityProps) {
  const [loginSessions, setLoginSessions] = useState<LoginSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from API
    const fetchLoginActivity = async () => {
      setIsLoading(true);
      try {
        // Simulated API response
        const mockLoginSessions: LoginSession[] = [
          { 
            id: '1', 
            device: 'Chrome on Windows',
            location: 'New Delhi, India',
            ipAddress: '157.42.xxx.xx',
            timestamp: '2023-06-13T15:45:00',
            deviceType: 'desktop',
            current: true
          },
          { 
            id: '2', 
            device: 'Safari on iPhone',
            location: 'Mumbai, India',
            ipAddress: '103.25.xxx.xx',
            timestamp: '2023-06-12T09:30:00',
            deviceType: 'mobile',
            current: false
          },
          { 
            id: '3', 
            device: 'Edge on Windows',
            location: 'Bangalore, India',
            ipAddress: '122.16.xxx.xx',
            timestamp: '2023-06-10T14:15:00',
            deviceType: 'desktop',
            current: false
          },
        ];
        
        setLoginSessions(mockLoginSessions);
      } catch (error) {
        console.error('Error fetching login activity:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoginActivity();
  }, [userId]);

  if (isLoading) {
    return <div className="bg-white rounded-lg shadow-sm p-6">Loading login activity...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Login Activity</h2>
        <p className="text-sm text-gray-500 mt-1">
          This shows your recent sign-in activity across devices
        </p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {loginSessions.length > 0 ? (
          loginSessions.map(session => (
            <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                    {session.deviceType === 'mobile' ? (
                      <Smartphone size={20} />
                    ) : (
                      <Monitor size={20} />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{session.device}</h3>
                      {session.current && (
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                          Current session
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Map size={14} />
                        <span>{session.location}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{new Date(session.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  {session.ipAddress}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            No login activity available.
          </div>
        )}
      </div>
      
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <button className="text-sm text-[#094d88] font-medium hover:text-[#10ac8b] transition-colors">
          Sign out of all other sessions
        </button>
      </div>
    </div>
  );
}
