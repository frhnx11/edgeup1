import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useUserTraitsStore } from '../../../store/useUserTraitsStore';
import { FEATURE_REGISTRY } from '../../../config/featureRegistry';
import {
  TRAIT_DEFINITIONS,
  TRAIT_CATEGORY_META,
  getTraitsByCategory
} from '../../../config/traitFeatureMapping';
import type { TraitCategory, TraitKey } from '../../../config/traitFeatureMapping';

// Get Lucide icon by name
const getIcon = (iconName: string) => {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || LucideIcons.Circle;
};

// Category order for display
const CATEGORY_ORDER: TraitCategory[] = ['social', 'learning', 'pace', 'communication', 'content', 'motivation', 'ui'];

// Get trait level label
const getTraitLevel = (value: number): { label: string; color: string } => {
  if (value >= 0.8) return { label: 'Very High', color: 'text-brand-secondary' };
  if (value >= 0.6) return { label: 'High', color: 'text-brand-primary' };
  if (value >= 0.4) return { label: 'Moderate', color: 'text-gray-600' };
  if (value >= 0.2) return { label: 'Low', color: 'text-orange-500' };
  return { label: 'Very Low', color: 'text-red-500' };
};

// Get progress bar color based on value
const getProgressColor = (value: number): string => {
  if (value >= 0.7) return 'from-brand-secondary to-brand-accent';
  if (value >= 0.5) return 'from-brand-primary to-brand-secondary';
  if (value >= 0.3) return 'from-yellow-500 to-orange-500';
  return 'from-orange-500 to-red-500';
};

// Format trait key to readable name
const formatTraitName = (traitKey: string): string => {
  const definition = TRAIT_DEFINITIONS[traitKey as keyof typeof TRAIT_DEFINITIONS];
  if (definition) {
    return definition.name;
  }
  return traitKey
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Get comparison symbol
const getComparisonText = (comparison: string): string => {
  switch (comparison) {
    case '>=': return 'at least';
    case '>': return 'more than';
    case '<=': return 'at most';
    case '<': return 'less than';
    default: return '';
  }
};

export const FeaturesReportTab: React.FC = () => {
  const personalityReview = useUserTraitsStore((state) => state.personalityReview);
  const traits = useUserTraitsStore((state) => state.traits);
  const quizCompletedAt = useUserTraitsStore((state) => state.quizCompletedAt);
  const enableFeature = useUserTraitsStore((state) => state.enableFeature);
  const disableFeature = useUserTraitsStore((state) => state.disableFeature);
  const manuallyEnabled = useUserTraitsStore((state) => state.manuallyEnabled);
  const manuallyDisabled = useUserTraitsStore((state) => state.manuallyDisabled);
  const getEnabledFeatures = useUserTraitsStore((state) => state.getEnabledFeatures);

  const [activeTab, setActiveTab] = useState<'traits' | 'features'>('traits');
  // All categories are always expanded - no state needed

  // Re-calculate enabled features when manual lists change
  const enabledFeatures = React.useMemo(() => {
    return getEnabledFeatures();
  }, [getEnabledFeatures, manuallyEnabled, manuallyDisabled, traits]);

  // Get all features to show hidden ones
  const allFeatures = FEATURE_REGISTRY;
  const hiddenFeatures = allFeatures.filter(f => !enabledFeatures.some(ef => ef.id === f.id));

  // Get trait value with fallback
  const getTraitValue = (traitKey: string): number => {
    return traits[traitKey as keyof typeof traits] ?? 0.5;
  };

  // Check if a trait requirement is met
  const isTraitMet = (trait: string, threshold: number, comparison: string): boolean => {
    const value = getTraitValue(trait);
    switch (comparison) {
      case '>=': return value >= threshold;
      case '>': return value > threshold;
      case '<=': return value <= threshold;
      case '<': return value < threshold;
      default: return false;
    }
  };

  // Format date
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Not completed';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <LucideIcons.Sparkles className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Your PASCO Profile</h1>
        </div>
        <p className="text-white/90 text-lg mb-4">
          Personalized Academic Study & Career Optimization - Your detailed learning profile based on the personality assessment.
        </p>
        {quizCompletedAt && (
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <LucideIcons.Calendar className="w-4 h-4" />
            <span>Assessment completed on {formatDate(quizCompletedAt)}</span>
          </div>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
        <button
          onClick={() => setActiveTab('traits')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'traits'
              ? 'bg-white text-brand-primary shadow-md'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <LucideIcons.BarChart3 className="w-5 h-5" />
          Trait Analysis
        </button>
        <button
          onClick={() => setActiveTab('features')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'features'
              ? 'bg-white text-brand-primary shadow-md'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <LucideIcons.Puzzle className="w-5 h-5" />
          Enabled Features ({enabledFeatures.length})
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'traits' ? (
          <motion.div
            key="traits"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Quick Summary */}
            {personalityReview && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <LucideIcons.Brain className="w-6 h-6 text-brand-primary" />
                  Quick Summary
                </h2>
                <p className="text-gray-600 mb-6">{personalityReview.summary}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-brand-primary/5 rounded-xl p-4 border border-brand-primary/20">
                    <div className="text-xs text-brand-primary font-semibold uppercase tracking-wide mb-1">Learning Style</div>
                    <div className="text-lg font-bold text-gray-800 capitalize">
                      {personalityReview.primaryLearningStyle.replace('_', ' ')}
                    </div>
                  </div>
                  <div className="bg-brand-secondary/5 rounded-xl p-4 border border-brand-secondary/20">
                    <div className="text-xs text-brand-secondary font-semibold uppercase tracking-wide mb-1">Study Approach</div>
                    <div className="text-lg font-bold text-gray-800 capitalize">
                      {personalityReview.studyApproach}
                    </div>
                  </div>
                  <div className="bg-brand-primary/5 rounded-xl p-4 border border-brand-primary/20">
                    <div className="text-xs text-brand-primary font-semibold uppercase tracking-wide mb-1">Focus Style</div>
                    <div className="text-lg font-bold text-gray-800 capitalize">
                      {personalityReview.pacePreference.replace('_', ' ')}
                    </div>
                  </div>
                  <div className="bg-brand-secondary/5 rounded-xl p-4 border border-brand-secondary/20">
                    <div className="text-xs text-brand-secondary font-semibold uppercase tracking-wide mb-1">Tone</div>
                    <div className="text-lg font-bold text-gray-800 capitalize">
                      {personalityReview.communicationStyle}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Strengths & Areas to Improve */}
            {personalityReview && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <LucideIcons.TrendingUp className="w-5 h-5 text-brand-secondary" />
                    Your Strengths
                  </h3>
                  <div className="space-y-3">
                    {personalityReview.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-brand-secondary/5 rounded-lg border border-brand-secondary/20">
                        <div className="w-10 h-10 rounded-full bg-brand-secondary/20 flex items-center justify-center">
                          <LucideIcons.Star className="w-5 h-5 text-brand-secondary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{formatTraitName(strength.trait)}</div>
                          <div className="text-sm text-gray-500">{strength.description}</div>
                        </div>
                        <div className="text-lg font-bold text-brand-secondary">
                          {Math.round(strength.value * 100)}%
                        </div>
                      </div>
                    ))}
                    {personalityReview.strengths.length === 0 && (
                      <p className="text-gray-500 text-center py-4">Complete the assessment to see your strengths</p>
                    )}
                  </div>
                </div>

                {/* Areas to Improve */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <LucideIcons.Target className="w-5 h-5 text-orange-500" />
                    Areas to Develop
                  </h3>
                  <div className="space-y-3">
                    {personalityReview.areasToImprove.map((area, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <LucideIcons.Lightbulb className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{formatTraitName(area.trait)}</div>
                          <div className="text-sm text-gray-500">{area.description}</div>
                        </div>
                        <div className="text-lg font-bold text-orange-500">
                          {Math.round(area.value * 100)}%
                        </div>
                      </div>
                    ))}
                    {personalityReview.areasToImprove.length === 0 && (
                      <p className="text-gray-500 text-center py-4">Great job! No major areas identified for improvement.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Trait Breakdown by Category */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <LucideIcons.BarChart3 className="w-6 h-6 text-brand-primary" />
                Detailed Trait Analysis
              </h2>

              <div className="space-y-4">
                {CATEGORY_ORDER.map((category) => {
                  const categoryMeta = TRAIT_CATEGORY_META[category];
                  const CategoryIcon = getIcon(categoryMeta.icon);
                  const categoryTraits = getTraitsByCategory(category);

                  // Calculate category average
                  const categoryAvg = categoryTraits.reduce((sum, trait) => sum + getTraitValue(trait), 0) / categoryTraits.length;

                  return (
                    <div
                      key={category}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                    >
                      {/* Category Header */}
                      <div className="w-full flex items-center justify-between p-4 bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center`}>
                            <CategoryIcon className="w-5 h-5 text-brand-primary" />
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-gray-800">{categoryMeta.name}</div>
                            <div className="text-sm text-gray-500">{categoryTraits.length} traits</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-lg font-bold text-brand-primary">{Math.round(categoryAvg * 100)}%</div>
                            <div className="text-xs text-gray-500">Average</div>
                          </div>
                        </div>
                      </div>

                      {/* Traits - Always Expanded */}
                      <div>
                            <div className="p-4 space-y-4 border-t border-gray-100">
                              {categoryTraits.map((traitKey) => {
                                const traitDef = TRAIT_DEFINITIONS[traitKey];
                                const value = getTraitValue(traitKey);
                                const level = getTraitLevel(value);

                                return (
                                  <div key={traitKey} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="font-semibold text-gray-800">{traitDef.name}</div>
                                        <div className="text-xs text-gray-500">{traitDef.description}</div>
                                      </div>
                                      <div className="text-right">
                                        <div className={`text-lg font-bold ${level.color}`}>
                                          {Math.round(value * 100)}%
                                        </div>
                                        <div className={`text-xs ${level.color}`}>{level.label}</div>
                                      </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${value * 100}%` }}
                                        transition={{ duration: 0.5, delay: 0.1 }}
                                        className={`absolute left-0 top-0 h-full bg-gradient-to-r ${getProgressColor(value)} rounded-full`}
                                      />
                                    </div>

                                    {/* Low/High Labels */}
                                    <div className="flex justify-between text-xs text-gray-400">
                                      <span>{traitDef.lowLabel}</span>
                                      <span>{traitDef.highLabel}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="features"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Enabled Features */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <LucideIcons.Unlock className="w-6 h-6 text-brand-secondary" />
                Enabled Features ({enabledFeatures.length})
              </h2>

              {enabledFeatures.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <LucideIcons.Info className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No features enabled. Enable features from the hidden section below.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {enabledFeatures.map((feature, index) => {
                    const IconComponent = getIcon(feature.icon);
                    return (
                      <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border border-brand-secondary/30 bg-brand-secondary/5 rounded-xl p-5"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-brand-secondary/20 flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-6 h-6 text-brand-secondary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-bold text-gray-800 text-lg">{feature.name}</h3>
                              <button
                                onClick={() => disableFeature(feature.id)}
                                className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <LucideIcons.EyeOff className="w-4 h-4" />
                                Disable
                              </button>
                            </div>
                            <p className="text-gray-600 text-sm">{feature.description}</p>

                            {/* Why Enabled */}
                            <div className="mt-4 bg-white rounded-lg p-3 border border-brand-secondary/20">
                              <div className="text-xs font-semibold text-brand-secondary uppercase tracking-wide mb-2">
                                Why this is enabled for you:
                              </div>
                              <div className="space-y-2">
                                {feature.requiredTraits.map((req, i) => {
                                  const userValue = getTraitValue(req.trait);
                                  return (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                      <LucideIcons.CheckCircle2 className="w-4 h-4 text-brand-secondary flex-shrink-0" />
                                      <span className="text-gray-700">
                                        <span className="font-medium">{formatTraitName(req.trait)}</span>
                                        {': '}
                                        <span className="text-brand-secondary font-semibold">{Math.round(userValue * 100)}%</span>
                                        {' '}
                                        <span className="text-gray-500">
                                          ({getComparisonText(req.comparison)} {Math.round(req.threshold * 100)}% required)
                                        </span>
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Hidden Features */}
            {hiddenFeatures.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <LucideIcons.EyeOff className="w-6 h-6 text-gray-400" />
                  Hidden Features ({hiddenFeatures.length})
                </h2>
                <p className="text-gray-500 mb-6 text-sm">
                  These features are hidden based on your profile. Click "Enable" to add them to your dashboard.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hiddenFeatures.map((feature, index) => {
                    const IconComponent = getIcon(feature.icon);
                    return (
                      <motion.div
                        key={feature.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.03 }}
                        className="border border-gray-200 bg-gray-50/50 rounded-xl p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-gray-700">{feature.name}</h3>
                              <button
                                onClick={() => enableFeature(feature.id)}
                                className="px-3 py-1.5 text-sm font-medium text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <LucideIcons.Eye className="w-4 h-4" />
                                Enable
                              </button>
                            </div>
                            <p className="text-gray-500 text-xs">{feature.description}</p>

                            {/* What's needed */}
                            <div className="mt-3 text-xs text-gray-500">
                              <span className="font-medium">Trait scores: </span>
                              {feature.requiredTraits.map((req, i) => {
                                const userValue = getTraitValue(req.trait);
                                const isMet = isTraitMet(req.trait, req.threshold, req.comparison);
                                return (
                                  <span key={i} className={isMet ? 'text-brand-secondary' : 'text-orange-500'}>
                                    {formatTraitName(req.trait)} ({Math.round(userValue * 100)}%/{Math.round(req.threshold * 100)}%)
                                    {i < feature.requiredTraits.length - 1 ? ', ' : ''}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeaturesReportTab;
