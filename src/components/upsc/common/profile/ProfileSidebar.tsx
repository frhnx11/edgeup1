import { formatDate } from '../../utils/formatters';

interface ProfileSidebarProps {
  firstName: string;
  surname: string;
  email: string;
  preferredLanguage: string;
  firstAccess: string;
  lastAccess: string;
}

export function ProfileSidebar({
  firstName,
  surname,
  email,
  preferredLanguage,
  firstAccess,
  lastAccess
}: ProfileSidebarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Profile Details</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm text-gray-500 mb-1">First name</h3>
          <p className="text-gray-900">{firstName}</p>
        </div>
        
        <div>
          <h3 className="text-sm text-gray-500 mb-1">Surname</h3>
          <p className="text-gray-900">{surname}</p>
        </div>
        
        <div>
          <h3 className="text-sm text-gray-500 mb-1">Email address</h3>
          <p className="text-gray-900">{email}</p>
        </div>
        
        <div>
          <h3 className="text-sm text-gray-500 mb-1">Preferred language</h3>
          <p className="text-gray-900">{preferredLanguage}</p>
        </div>
        
        <div>
          <h3 className="text-sm text-gray-500 mb-1">First access</h3>
          <p className="text-gray-900">{formatDate(firstAccess)}</p>
        </div>
        
        <div>
          <h3 className="text-sm text-gray-500 mb-1">Last access</h3>
          <p className="text-gray-900">{formatDate(lastAccess)}</p>
        </div>
      </div>
    </div>
  );
}
