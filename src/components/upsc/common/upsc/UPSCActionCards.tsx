import React from 'react';
import { MessageSquare, User, Settings, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ActionCardProps {
  icon: React.ElementType;
  title: string;
  bgColor: string;
  onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon: Icon, title, bgColor, onClick }) => {
  return (
    <motion.div
      className={`${bgColor} rounded-xl py-4 px-6 flex flex-col items-center justify-center cursor-pointer w-full`}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="mb-2 flex items-center justify-center">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <p className="font-medium text-sm text-white text-center">{title}</p>
    </motion.div>
  );
};

export function UPSCActionCards() {
  const navigate = useNavigate();
  
  // Action handlers
  const handleMessagesClick = () => {
    console.log('Messages clicked');
  };

  const handleProfileClick = () => {
    // Navigate to the profile page when the pink Profile card is clicked
    navigate('/profile/admin');
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
  };

  const handleGradesClick = () => {
    console.log('Grades clicked');
  };

  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      <ActionCard
        icon={MessageSquare}
        title="Messages"
        bgColor="bg-blue-500"
        onClick={handleMessagesClick}
      />
      <ActionCard
        icon={User}
        title="Profile"
        bgColor="bg-pink-500"
        onClick={handleProfileClick}
      />
      <ActionCard
        icon={Settings}
        title="Settings"
        bgColor="bg-emerald-500"
        onClick={handleSettingsClick}
      />
      <ActionCard
        icon={GraduationCap}
        title="Grades"
        bgColor="bg-amber-500"
        onClick={handleGradesClick}
      />
    </div>
  );
}
