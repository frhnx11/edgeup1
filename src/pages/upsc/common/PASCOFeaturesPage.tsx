import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { PreGeneratedVoiceAgent } from '../../../components/upsc/common/PreGeneratedVoiceAgent';
import { useUserTraitsStore } from '../../../store/useUserTraitsStore';
import { FEATURE_COMPONENTS } from '../../../components/upsc/features';
import { FeaturesReportTab } from '../../../components/upsc/common/FeaturesReportTab';

// Loading Component
const LoadingFeature = () => (
  <div className="flex items-center justify-center py-20">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading feature...</p>
    </div>
  </div>
);

// Get Lucide icon by name
const getIcon = (iconName: string) => {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || LucideIcons.Circle;
};

// Special "Features" tab that shows the report
const FEATURES_TAB = {
  id: 'features-report',
  name: 'Features',
  icon: 'Sparkles',
  isReportTab: true
};

const PASCOFeaturesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Subscribe to manual lists to trigger re-render when features are enabled/disabled
  const manuallyEnabled = useUserTraitsStore((state) => state.manuallyEnabled);
  const manuallyDisabled = useUserTraitsStore((state) => state.manuallyDisabled);
  const traits = useUserTraitsStore((state) => state.traits);
  const getEnabledFeatures = useUserTraitsStore((state) => state.getEnabledFeatures);

  // Re-calculate enabled features when manual lists change
  const enabledFeatures = React.useMemo(() => {
    return getEnabledFeatures();
  }, [getEnabledFeatures, manuallyEnabled, manuallyDisabled, traits]);

  // Default to "features-report" tab (the Features report)
  const [activeTab, setActiveTab] = useState<string>(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'features-report') return tabParam;
    if (tabParam && enabledFeatures.some(f => f.id === tabParam)) {
      return tabParam;
    }
    return 'features-report'; // Default to Features report tab
  });

  // Clear URL param after reading
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setSearchParams({}, { replace: true });
    }
  }, []);

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [activeTab]);

  // Render content based on active tab
  const renderContent = () => {
    // If Features report tab is active
    if (activeTab === 'features-report') {
      return <FeaturesReportTab />;
    }

    // Find the active feature
    const activeFeature = enabledFeatures.find(f => f.id === activeTab);

    if (!activeFeature) {
      return (
        <div className="text-center py-20 text-gray-500">
          <LucideIcons.AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Feature Not Found</h3>
          <p>Select a feature from the tabs above.</p>
        </div>
      );
    }

    const FeatureComponent = FEATURE_COMPONENTS[activeFeature.component];

    if (!FeatureComponent) {
      return (
        <div className="text-center py-20 text-gray-500">
          <LucideIcons.AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Feature Not Found</h3>
          <p>The component for "{activeFeature.name}" could not be loaded.</p>
        </div>
      );
    }

    return (
      <Suspense fallback={<LoadingFeature />}>
        <FeatureComponent />
      </Suspense>
    );
  };

  const getColorClasses = (isActive: boolean) => {
    if (isActive) {
      return 'bg-brand-primary text-white';
    }
    return 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200';
  };

  // Build tabs: Features report first, then enabled feature tabs
  const allTabs = [
    FEATURES_TAB,
    ...enabledFeatures.map(f => ({
      id: f.id,
      name: f.name,
      icon: f.icon,
      isReportTab: false
    }))
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Top Navbar with Tabs */}
        <div className="bg-white shadow-md rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {allTabs.map((tab) => {
              const IconComponent = getIcon(tab.icon);
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${getColorClasses(
                    activeTab === tab.id
                  )}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    scale: activeTab === tab.id ? 1 : 0.98
                  }}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{tab.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>

      {/* Voice Agent */}
      <PreGeneratedVoiceAgent currentTab={activeTab} position="bottom-right" />
    </DashboardLayout>
  );
};

export default PASCOFeaturesPage;
