import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import {
  Sparkles,
  ArrowRight,
  Star,
  TrendingUp,
  Zap,
  Users,
  BookOpen,
  Clock,
  MessageSquare,
  FileText,
  Heart,
  Layout,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useUserTraitsStore } from '../../../store/useUserTraitsStore';
import {
  TRAIT_DEFINITIONS,
  TRAIT_CATEGORY_META,
  getTraitsByCategory
} from '../../../config/traitFeatureMapping';
import type { TraitCategory, TraitKey } from '../../../config/traitFeatureMapping';
import { CATEGORY_LABELS } from '../../../config/featureRegistry';

// Category icons
const CATEGORY_ICONS: Record<TraitCategory, React.ElementType> = {
  social: Users,
  learning: BookOpen,
  pace: Clock,
  communication: MessageSquare,
  content: FileText,
  motivation: Heart,
  ui: Layout
};

// Trait bar component
const TraitBar: React.FC<{
  traitKey: TraitKey;
  value: number;
  showLabels?: boolean;
}> = ({ traitKey, value, showLabels = true }) => {
  const trait = TRAIT_DEFINITIONS[traitKey];
  const percentage = Math.round(value * 100);

  const getBarColor = () => {
    if (value >= 0.7) return 'bg-green-500';
    if (value < 0.4) return 'bg-orange-400';
    return 'bg-blue-500';
  };

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{trait.name}</span>
        <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
      </div>
      <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${getBarColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: 0.1 }}
        />
      </div>
      {showLabels && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">{trait.lowLabel}</span>
          <span className="text-xs text-gray-400">{trait.highLabel}</span>
        </div>
      )}
    </div>
  );
};

// Category card component - Always expanded
const CategoryCard: React.FC<{
  category: TraitCategory;
  traits: Record<TraitKey, number>;
}> = ({ category, traits }) => {
  const meta = TRAIT_CATEGORY_META[category];
  const categoryTraits = getTraitsByCategory(category);
  const Icon = CATEGORY_ICONS[category];

  // Calculate category average
  const categoryAverage = useMemo(() => {
    const values = categoryTraits.map(t => traits[t] || 0.5);
    return values.reduce((a, b) => a + b, 0) / values.length;
  }, [categoryTraits, traits]);

  return (
    <motion.div
      className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Category Header - Not clickable */}
      <div className="w-full p-4 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-brand-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">{meta.name}</h3>
            <p className="text-sm text-gray-500">{categoryTraits.length} traits</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-brand-primary">
            {Math.round(categoryAverage * 100)}%
          </span>
          <p className="text-xs text-gray-500">Average</p>
        </div>
      </div>

      {/* Traits - Always visible */}
      <div className="border-t border-gray-100">
        <div className="p-4 space-y-1">
          {categoryTraits.map(traitKey => (
            <TraitBar
              key={traitKey}
              traitKey={traitKey}
              value={traits[traitKey] || 0.5}
              showLabels={false}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const PersonalityReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { traits, personalityReview, getEnabledFeatures } = useUserTraitsStore();

  // Get enabled features
  const enabledFeatures = useMemo(() => getEnabledFeatures(), [traits, getEnabledFeatures]);

  // Calculate radar chart data (category averages)
  const radarData = useMemo(() => {
    const categories: TraitCategory[] = ['social', 'learning', 'pace', 'communication', 'content', 'motivation', 'ui'];

    return categories.map(category => {
      const categoryTraits = getTraitsByCategory(category);
      const values = categoryTraits.map(t => traits[t] || 0.5);
      const average = values.reduce((a, b) => a + b, 0) / values.length;

      return {
        category: TRAIT_CATEGORY_META[category].name.split(' ')[0], // Short name
        fullName: TRAIT_CATEGORY_META[category].name,
        value: Math.round(average * 100),
        fullMark: 100
      };
    });
  }, [traits]);

  // Get strengths (traits >= 0.7)
  const strengths = useMemo(() => {
    return Object.entries(traits)
      .filter(([_, value]) => value >= 0.7)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([key, value]) => ({
        key: key as TraitKey,
        value,
        trait: TRAIT_DEFINITIONS[key as TraitKey]
      }));
  }, [traits]);

  // Get growth areas (traits < 0.4)
  const growthAreas = useMemo(() => {
    return Object.entries(traits)
      .filter(([_, value]) => value < 0.4)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 5)
      .map(([key, value]) => ({
        key: key as TraitKey,
        value,
        trait: TRAIT_DEFINITIONS[key as TraitKey]
      }));
  }, [traits]);

  const handleContinue = () => {
    navigate('/upsc/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-primary/80 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Sparkles className="w-10 h-10" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Your Learning Profile
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/90 max-w-2xl mx-auto"
          >
            {personalityReview?.summary ||
              "Based on your assessment, we've created a personalized learning profile to help you succeed."}
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Radar Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Trait Overview
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis
                  dataKey="category"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: '#9ca3af', fontSize: 10 }}
                />
                <Radar
                  name="Your Profile"
                  dataKey="value"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white shadow-lg rounded-lg p-3 border">
                          <p className="font-semibold text-gray-900">{data.fullName}</p>
                          <p className="text-blue-600 font-bold">{data.value}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Strengths & Growth Areas */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Star className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Your Strengths</h2>
            </div>
            {strengths.length > 0 ? (
              <div className="space-y-3">
                {strengths.map(({ key, value, trait }) => (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-3 bg-green-50 rounded-xl"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{trait.name}</p>
                      <p className="text-sm text-gray-600">{trait.highLabel}</p>
                    </div>
                    <span className="font-bold text-green-600">
                      {Math.round(value * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Complete the assessment to see your strengths
              </p>
            )}
          </motion.div>

          {/* Growth Areas */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Growth Areas</h2>
            </div>
            {growthAreas.length > 0 ? (
              <div className="space-y-3">
                {growthAreas.map(({ key, value, trait }) => (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl"
                  >
                    <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{trait.name}</p>
                      <p className="text-sm text-gray-600">{trait.lowLabel}</p>
                    </div>
                    <span className="font-bold text-orange-600">
                      {Math.round(value * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Great job! No major growth areas identified
              </p>
            )}
          </motion.div>
        </div>

        {/* Trait Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Detailed Trait Analysis
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {(['social', 'learning', 'pace', 'communication', 'content', 'motivation', 'ui'] as TraitCategory[]).map(
              category => (
                <CategoryCard
                  key={category}
                  category={category}
                  traits={traits as Record<TraitKey, number>}
                />
              )
            )}
          </div>
        </motion.div>

        {/* Unlocked Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Features Unlocked for You
              </h2>
              <p className="text-sm text-gray-600">
                {enabledFeatures.length} personalized features based on your profile
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {enabledFeatures.slice(0, 8).map(feature => (
              <div
                key={feature.id}
                className="bg-white rounded-xl p-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-brand-primary" />
                </div>
                <span className="text-sm font-medium text-gray-700 truncate">
                  {feature.name}
                </span>
              </div>
            ))}
          </div>

          {enabledFeatures.length > 8 && (
            <p className="text-center text-purple-600 font-medium mt-4">
              +{enabledFeatures.length - 8} more features
            </p>
          )}
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pb-8"
        >
          <motion.button
            onClick={handleContinue}
            className="inline-flex items-center gap-3 px-8 py-4 bg-brand-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Continue to Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
          <p className="text-gray-500 text-sm mt-3">
            You can always revisit this profile from your settings
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PersonalityReviewPage;
