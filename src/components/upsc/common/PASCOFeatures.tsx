import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  BookOpen,
  Clock,
  Users,
  BarChart3,
  Palette,
  ChevronRight,
  ArrowLeft,
  Lock,
  Star,
  Zap
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useUserTraitsStore, getMockTraits, generatePersonalityReview } from '../../../store/useUserTraitsStore';
import { CATEGORY_LABELS } from '../../../config/featureRegistry';
import type { Feature } from '../../../config/featureRegistry';
import { getFeatureComponent } from '../features';

// Category icons mapping (3 categories from actual features)
const CATEGORY_ICONS: Record<Feature['category'], React.ElementType> = {
  social: Users,
  analytics: BarChart3,
  productivity: Clock
};

// Category colors for styling (3 categories)
const CATEGORY_COLORS: Record<Feature['category'], { bg: string; text: string; border: string; gradient: string }> = {
  social: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-200',
    gradient: 'from-purple-500 to-purple-600'
  },
  analytics: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
    gradient: 'from-blue-500 to-blue-600'
  },
  productivity: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    border: 'border-green-200',
    gradient: 'from-green-500 to-green-600'
  }
};

// Get icon component from lucide
function getIconComponent(iconName: string): React.ElementType {
  const IconComponent = (LucideIcons as Record<string, React.ElementType>)[iconName];
  return IconComponent || Sparkles;
}

interface FeatureCardProps {
  feature: Feature;
  onClick: () => void;
  isEnabled: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, onClick, isEnabled }) => {
  const colors = CATEGORY_COLORS[feature.category];
  const IconComponent = getIconComponent(feature.icon);

  return (
    <motion.button
      onClick={isEnabled ? onClick : undefined}
      className={`relative w-full p-5 rounded-xl border-2 transition-all text-left ${
        isEnabled
          ? `${colors.bg} ${colors.border} hover:shadow-lg cursor-pointer`
          : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
      }`}
      whileHover={isEnabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={isEnabled ? { scale: 0.98 } : {}}
    >
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
        isEnabled ? `bg-gradient-to-br ${colors.gradient}` : 'bg-gray-300'
      }`}>
        {isEnabled ? (
          <IconComponent className="w-6 h-6 text-white" />
        ) : (
          <Lock className="w-5 h-5 text-gray-500" />
        )}
      </div>

      {/* Content */}
      <h3 className={`font-semibold mb-1 ${isEnabled ? 'text-gray-900' : 'text-gray-500'}`}>
        {feature.name}
      </h3>
      <p className={`text-sm ${isEnabled ? 'text-gray-600' : 'text-gray-400'}`}>
        {feature.description}
      </p>

      {/* Category badge */}
      <div className={`inline-flex items-center gap-1 mt-3 px-2 py-1 rounded-full text-xs font-medium ${
        isEnabled ? `${colors.bg} ${colors.text}` : 'bg-gray-100 text-gray-400'
      }`}>
        {CATEGORY_LABELS[feature.category]?.name || feature.category}
      </div>

      {/* Locked overlay */}
      {!isEnabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-xl">
          <span className="text-xs text-gray-500 font-medium">Complete quiz to unlock</span>
        </div>
      )}
    </motion.button>
  );
};

interface PASCOFeaturesProps {
  className?: string;
}

export const PASCOFeatures: React.FC<PASCOFeaturesProps> = ({ className = '' }) => {
  const {
    traits,
    getEnabledFeatures,
    hasCompletedQuiz,
    setTraits,
    setPersonalityReview
  } = useUserTraitsStore();

  const [activeFeature, setActiveFeature] = useState<Feature | null>(null);
  const [activeCategory, setActiveCategory] = useState<Feature['category'] | 'all'>('all');

  // Load mock data for testing if quiz not completed
  useEffect(() => {
    if (!hasCompletedQuiz()) {
      // For demo purposes, load mock traits
      const mockTraits = getMockTraits();
      setTraits(mockTraits);
      setPersonalityReview(generatePersonalityReview(mockTraits));
    }
  }, [hasCompletedQuiz, setTraits, setPersonalityReview]);

  const enabledFeatures = useMemo(() => getEnabledFeatures(), [traits, getEnabledFeatures]);

  // Group features by category (3 categories)
  const featuresByCategory = useMemo(() => {
    const grouped: Record<Feature['category'], Feature[]> = {
      social: [],
      analytics: [],
      productivity: []
    };

    enabledFeatures.forEach(feature => {
      if (grouped[feature.category]) {
        grouped[feature.category].push(feature);
      }
    });

    return grouped;
  }, [enabledFeatures]);

  // Get features to display based on active category
  const displayFeatures = useMemo(() => {
    if (activeCategory === 'all') {
      return enabledFeatures;
    }
    return featuresByCategory[activeCategory] || [];
  }, [activeCategory, enabledFeatures, featuresByCategory]);

  // Categories with feature counts
  const categories = useMemo(() => {
    return [
      { id: 'all' as const, name: 'All Features', count: enabledFeatures.length },
      ...Object.entries(CATEGORY_LABELS).map(([id, { name }]) => ({
        id: id as Feature['category'],
        name,
        count: featuresByCategory[id as Feature['category']]?.length || 0
      }))
    ].filter(cat => cat.id === 'all' || cat.count > 0);
  }, [enabledFeatures, featuresByCategory]);

  // Handle opening a feature
  const handleOpenFeature = (feature: Feature) => {
    const Component = getFeatureComponent(feature.component);
    if (Component) {
      setActiveFeature(feature);
    }
  };

  // Render active feature component
  if (activeFeature) {
    const FeatureComponent = getFeatureComponent(activeFeature.component);
    if (FeatureComponent) {
      return (
        <div className={`min-h-screen bg-gray-50 ${className}`}>
          {/* Header */}
          <div className="bg-white shadow-sm rounded-xl p-4 mb-6">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => setActiveFeature(null)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Features</span>
              </motion.button>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${CATEGORY_COLORS[activeFeature.category].gradient}`}>
                  {React.createElement(getIconComponent(activeFeature.icon), {
                    className: 'w-5 h-5 text-white'
                  })}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{activeFeature.name}</h2>
                  <p className="text-sm text-gray-500">{activeFeature.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Component with Suspense for lazy loading */}
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
            </div>
          }>
            <FeatureComponent />
          </Suspense>
        </div>
      );
    }
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="bg-white shadow-sm rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-primary/80 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">PASCO Features</h1>
            <p className="text-gray-500">
              Personalized features based on your learning profile
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">
              {enabledFeatures.length} features unlocked
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-700">
              {Object.keys(featuresByCategory).filter(cat =>
                featuresByCategory[cat as Feature['category']].length > 0
              ).length} categories active
            </span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white shadow-sm rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            const CategoryIcon = category.id === 'all'
              ? Sparkles
              : CATEGORY_ICONS[category.id as Feature['category']];

            return (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CategoryIcon className="w-4 h-4" />
                <span>{category.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  isActive ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {category.count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Features Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {displayFeatures.length > 0 ? (
            displayFeatures.map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                onClick={() => handleOpenFeature(feature)}
                isEnabled={true}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No features in this category
              </h3>
              <p className="text-gray-500">
                Complete the assessment quiz to unlock personalized features
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Coming Soon Features */}
      {enabledFeatures.length > 0 && (
        <div className="mt-8 bg-white shadow-sm rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
          <p className="text-gray-500 text-sm mb-4">
            More features are being developed based on your learning profile
          </p>
          <div className="flex items-center gap-3 text-gray-400">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-sm">+10 more features</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PASCOFeatures;
