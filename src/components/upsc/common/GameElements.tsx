import { useState } from 'react';
import { useGameStore } from '../../../store/useGameStore';
import {
  Trophy,
  Star,
  Zap,
  Award,
  Target,
  Flame,
  Gift,
  Sparkles,
  Crown,
  Shield
} from 'lucide-react';

export function LevelProgress() {
  const { level, xp } = useGameStore();
  const xpForNextLevel = (level + 1) * (level + 1) * 100;
  const currentLevelXP = level * level * 100;
  const progress = ((xp - currentLevelXP) / (xpForNextLevel - currentLevelXP)) * 100;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-lg flex items-center justify-center">
          <Trophy className="w-5 h-5" />
        </div>
        <div>
          <div className="font-medium">Level {level}</div>
          <div className="text-sm text-gray-600">{xp} XP</div>
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-primary rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-gray-600 text-right">
        {Math.round(xpForNextLevel - xp)} XP to Level {level + 1}
      </div>
    </div>
  );
}

export function DailyStreak() {
  const { dailyStreak } = useGameStore();

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-secondary/10 text-brand-secondary rounded-lg flex items-center justify-center">
          <Flame className="w-5 h-5" />
        </div>
        <div>
          <div className="font-medium">{dailyStreak} Day Streak</div>
          <div className="text-sm text-gray-600">Keep it up!</div>
        </div>
      </div>
    </div>
  );
}

export function QuestLog() {
  const { currentQuests, completeQuest } = useGameStore();

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold">Active Quests</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {currentQuests.map(quest => (
          <div key={quest.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  quest.type === 'daily' ? 'bg-brand-primary/10 text-brand-primary' :
                  quest.type === 'weekly' ? 'bg-brand-secondary/10 text-brand-secondary' :
                  'bg-brand-accent/10 text-brand-accent'
                }`}>
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium">{quest.title}</div>
                  <div className="text-sm text-gray-600">{quest.description}</div>
                </div>
              </div>
              {!quest.completed && (
                <button
                  onClick={() => completeQuest(quest.id)}
                  className="px-3 py-1 bg-brand-primary text-white text-sm rounded-lg hover:bg-brand-primary/90 transition-colors"
                >
                  Complete
                </button>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-brand-primary">
                <Star className="w-4 h-4" />
                {quest.reward.xp} XP
              </div>
              <div className="flex items-center gap-1 text-brand-secondary">
                <Gift className="w-4 h-4" />
                {quest.reward.coins} Coins
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Achievements() {
  const { achievements } = useGameStore();

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold">Achievements</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 p-4">
        {achievements.map(achievement => (
          <div key={achievement.id} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium">{achievement.title}</div>
                <div className="text-sm text-gray-600">{achievement.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RewardPopup({ 
  reward,
  onClose 
}: { 
  reward: { xp: number; coins: number; message: string };
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
        <p className="text-gray-600 mb-4">{reward.message}</p>
        <div className="flex justify-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-brand-primary">
            <Star className="w-5 h-5" />
            <span className="font-bold">+{reward.xp} XP</span>
          </div>
          <div className="flex items-center gap-2 text-brand-secondary">
            <Gift className="w-5 h-5" />
            <span className="font-bold">+{reward.coins} Coins</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
        >
          Claim Reward
        </button>
      </div>
    </div>
  );
}