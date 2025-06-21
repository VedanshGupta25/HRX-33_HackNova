
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Coins, Zap, X } from 'lucide-react';

interface RewardData {
  points: number;
  xp: number;
  coins: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface RewardNotificationProps {
  reward: RewardData;
  unlockedAchievements: Achievement[];
  levelUp: boolean;
  newLevel?: number;
  onClose: () => void;
}

export const RewardNotification: React.FC<RewardNotificationProps> = ({
  reward,
  unlockedAchievements,
  levelUp,
  newLevel,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <Card className="max-w-md w-full mx-4 bg-white shadow-2xl animate-scale-in">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-800">🎉 Rewards Earned!</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Rewards Display */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Star className="h-6 w-6 text-blue-500 mx-auto mb-1" />
              <div className="font-bold text-blue-700">+{reward.points}</div>
              <div className="text-xs text-blue-600">Points</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Zap className="h-6 w-6 text-purple-500 mx-auto mb-1" />
              <div className="font-bold text-purple-700">+{reward.xp}</div>
              <div className="text-xs text-purple-600">XP</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <Coins className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
              <div className="font-bold text-yellow-700">+{reward.coins}</div>
              <div className="text-xs text-yellow-600">Coins</div>
            </div>
          </div>

          {/* Level Up */}
          {levelUp && (
            <div className="mb-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg text-center">
              <Trophy className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-bold text-purple-800">Level Up!</div>
              <div className="text-purple-600">You reached Level {newLevel}!</div>
            </div>
          )}

          {/* Achievements */}
          {unlockedAchievements.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700">🏆 Achievements Unlocked:</h4>
              {unlockedAchievements.map((achievement) => (
                <div key={achievement.id} className="p-3 bg-green-50 rounded-lg flex items-center gap-3">
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    New!
                  </Badge>
                  <div>
                    <div className="font-semibold text-green-800">{achievement.title}</div>
                    <div className="text-sm text-green-600">{achievement.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button 
            onClick={onClose}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
          >
            Continue Learning
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
