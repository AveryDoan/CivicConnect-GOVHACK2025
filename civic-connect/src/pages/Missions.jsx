
import React, { useState, useEffect } from "react";
import { Mission } from "@/api/entities";
import { UserMission } from "@/api/entities";
import { User } from "@/api/entities";
import { Transaction } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Coins, 
  Target, 
  Clock, 
  CheckCircle,
  Flame,
  Calendar,
  Trophy
} from "lucide-react";
import MissionCard from "../components/missions/MissionCard";
import CoinDisplay from "../components/missions/CoinDisplay";

export default function Missions() {
  const [missions, setMissions] = useState([]);
  const [user, setUser] = useState(null);
  const [userMissions, setUserMissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [missionData, userData, userMissionData] = await Promise.all([
        Mission.filter({ is_active: true, mission_type: { $in: ["quiz", "article", "reflection"] } }),
        User.me(),
        UserMission.filter({ completion_date: new Date().toISOString().split('T')[0] })
      ]);
      
      setMissions(missionData.slice(0, 3)); // Only show 3 daily missions
      setUser(userData);
      setUserMissions(userMissionData);
    } catch (error) {
      console.error("Error loading missions:", error);
    }
    setIsLoading(false);
  };

  const completeMission = async (mission, userResponse) => {
    try {
      // Create user mission record
      await UserMission.create({
        user_email: user.email,
        mission_id: mission.id,
        completion_date: new Date().toISOString().split('T')[0],
        coins_earned: mission.coins_reward,
        user_response: userResponse
      });

      // Create transaction record
      await Transaction.create({
        user_email: user.email,
        transaction_type: 'earned',
        amount: mission.coins_reward,
        source: mission.id,
        description: `Completed mission: ${mission.title}`
      });

      // Update user coins and streak
      const newCoinBalance = (user.civic_coins || 0) + mission.coins_reward;
      const newStreak = user.last_mission_date === new Date().toISOString().split('T')[0] 
        ? user.daily_streak 
        : (user.daily_streak || 0) + 1;

      await User.updateMyUserData({
        civic_coins: newCoinBalance,
        daily_streak: newStreak,
        last_mission_date: new Date().toISOString().split('T')[0]
      });

      // Reload data
      loadData();
    } catch (error) {
      console.error("Error completing mission:", error);
    }
  };

  const completedMissionIds = userMissions.map(um => um.mission_id);
  const completedToday = userMissions.length;
  const dailyProgress = (completedToday / 3) * 100;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative rounded-xl overflow-hidden mb-8 p-8 h-64 flex flex-col justify-end" style={{backgroundImage: "url('https://cdn.midjourney.com/444f7d53-06c2-426e-9df7-0b13bc63a540/0_2.png')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="relative">
          <h1 className="text-4xl font-bold text-white mb-2">Daily Missions</h1>
          <p className="text-white/90 text-lg">
            Complete daily tasks to earn Civic Coins and build your civic knowledge.
          </p>
        </div>
      </div>

      {/* Coin Display */}
      <CoinDisplay user={user} />

      {/* Daily Progress */}
      <Card className="mb-8 shadow-lg border-0 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-yellow-600" />
              <div>
                <CardTitle className="text-xl text-yellow-900">Today's Progress</CardTitle>
                <p className="text-yellow-700">
                  {completedToday} of 3 missions completed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-orange-600">{user?.daily_streak || 0} day streak</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={dailyProgress} className="h-3 mb-2" />
          <div className="flex justify-between text-sm text-yellow-700">
            <span>Daily Goal</span>
            <span>{completedToday}/3 missions</span>
          </div>
        </CardContent>
      </Card>

      {/* Missions Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {isLoading ? Array(3).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse h-64 bg-gray-200"></Card>
        )) : missions.map((mission, index) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            isCompleted={completedMissionIds.includes(mission.id)}
            onComplete={completeMission}
            missionNumber={index + 1}
          />
        ))}
      </div>

      {/* Weekly/Monthly Missions */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 border-2">
        <CardHeader>
          <CardTitle className="text-xl text-purple-900 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Bonus Missions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-xl">
            <div>
              <h4 className="font-medium text-gray-900">Weekly Challenge</h4>
              <p className="text-sm text-gray-600">Complete 15 daily missions this week</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-purple-600">+300 Coins</div>
              <div className="text-xs text-gray-500">Progress: 0/15</div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-white rounded-xl">
            <div>
              <h4 className="font-medium text-gray-900">Monthly Challenge</h4>
              <p className="text-sm text-gray-600">Log in 25 days this month</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-purple-600">+1,000 Coins</div>
              <div className="text-xs text-gray-500">Progress: 1/25</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
