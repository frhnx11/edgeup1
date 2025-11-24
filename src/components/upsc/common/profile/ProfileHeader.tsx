import { User } from 'lucide-react';

interface ProfileHeaderProps {
  firstName: string;
  surname: string;
  email: string;
  avatar?: string;
}

export function ProfileHeader({ firstName, surname, email, avatar }: ProfileHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-[#094d88] to-[#10ac8b] rounded-xl shadow-md overflow-hidden">
      <div className="flex flex-col md:flex-row items-center p-6 md:p-8 text-white">
        {/* Avatar */}
        <div className="mb-4 md:mb-0 md:mr-8">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-4 border-white/30">
            {avatar ? (
              <img src={avatar} alt={`${firstName} ${surname}`} className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-white" />
            )}
          </div>
        </div>
        
        {/* User Details */}
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {firstName} {surname}
          </h1>
          <p className="text-white/80">{email}</p>
        </div>
      </div>
      
      {/* Navigation Tabs - could be implemented in the future */}
      <div className="bg-white/10 px-6 py-3 flex gap-6">
        <button className="text-white font-medium border-b-2 border-white py-1">Profile</button>
        <button className="text-white/70 hover:text-white py-1 transition-colors">Preferences</button>
        <button className="text-white/70 hover:text-white py-1 transition-colors">Security</button>
      </div>
    </div>
  );
}
