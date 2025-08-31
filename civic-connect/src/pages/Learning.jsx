
import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { LearningModule } from "@/api/entities";
import { User } from "@/api/entities";
import { CivicActivity } from "@/api/entities";
import { Mission } from "@/api/entities";
import { UserMission } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Clock,
  Trophy,
  CheckCircle,
  PlayCircle,
  Award,
  Users,
  Vote,
  Building,
  Sparkles,
  Target,
  Coins,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ModuleViewer from "../components/learning/ModuleViewer"; // This import is kept but the component is no longer directly rendered as a full-page view. It might be used internally by ModuleQuizDialog or for other purposes.
import RecommendedModules from "../components/learning/RecommendedModules";
import ModuleCustomizer from "../components/learning/ModuleCustomizer";
import ModuleQuizDialog from "../components/learning/ModuleQuizDialog"; // New import

const categoryIcons = {
  democracy_basics: Building,
  voting: Vote,
  local_government: Users,
  rights_responsibilities: Award,
  civic_participation: Trophy
};

export default function Learning() {
  const location = useLocation();
  const [modules, setModules] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [recommendedModuleIds, setRecommendedModuleIds] = useState([]);
  const [isRecommending, setIsRecommending] = useState(true);
  const [dailyMissions, setDailyMissions] = useState([]);
  const [completedMissions, setCompletedMissions] = useState([]);
  const [showQuizDialog, setShowQuizDialog] = useState(false); // New state

  const getRecommendations = useCallback(async (userData, moduleData) => {
    if (!userData || !moduleData || moduleData.length === 0) {
      setIsRecommending(false);
      return;
    }

    // Simple caching to prevent re-fetching on re-renders
    const cachedRecs = sessionStorage.getItem('recommended_module_ids');
    if (cachedRecs) {
      setRecommendedModuleIds(JSON.parse(cachedRecs));
      setIsRecommending(false);
      return;
    }

    const moduleInfo = moduleData.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      category: m.category
    }));

    const prompt = `
      A new Australian user has the following profile:
      - Interests: ${JSON.stringify(userData.interests || [])}
      - Goals: ${JSON.stringify(userData.goals || [])}
      
      Based on this profile, recommend the top 3 most relevant learning modules from the following list.
      Prioritize modules that align with their stated goals and interests.
      
      Available Modules:
      ${JSON.stringify(moduleInfo)}
      
      Return a JSON object with a single key "recommended_module_ids" which is an array of the 3 most relevant module IDs.
    `;

    try {
      const response = await InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            recommended_module_ids: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["recommended_module_ids"]
        }
      });
      if (response && response.recommended_module_ids) {
        setRecommendedModuleIds(response.recommended_module_ids);
        sessionStorage.setItem('recommended_module_ids', JSON.stringify(response.recommended_module_ids));
      }
    } catch (error) {
      console.error("Error getting recommendations:", error);
    } finally {
      setIsRecommending(false);
    }
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
      const [moduleData, userData, missionData, userMissionData] = await Promise.all([
        LearningModule.list('-created_date'),
        User.me(),
        Mission.filter({ is_active: true, mission_type: { $in: ["quiz", "article", "reflection"] } }),
        UserMission.filter({ completion_date: today })
      ]);

      setModules(moduleData);
      setUser(userData);
      setDailyMissions(missionData.slice(0, 3)); // Only show 3 daily missions
      setCompletedMissions(userMissionData);

      const params = new URLSearchParams(location.search);
      const moduleIdFromUrl = params.get('module_id');
      if (moduleIdFromUrl) {
        const moduleToOpen = moduleData.find((m) => m.id === moduleIdFromUrl);
        if (moduleToOpen) {
          setSelectedModule(moduleToOpen);
          setShowQuizDialog(true); // Open dialog if module ID is in URL
        }
      }

      getRecommendations(userData, moduleData);
    } catch (error) {
      console.error("Error loading learning data:", error);
    }
    setIsLoading(false);
  }, [getRecommendations, location.search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleModuleComplete = async (moduleId, pointsEarned) => {
    try {
      // Update user data
      const completedModules = [...(user.completed_modules || []), moduleId];
      const newScore = (user.civic_score || 0) + pointsEarned;
      const newCoins = (user.civic_coins || 0) + pointsEarned; // New: Add pointsEarned to civic_coins

      await User.updateMyUserData({
        completed_modules: completedModules,
        civic_score: newScore,
        civic_coins: newCoins // New: Update civic_coins
      });

      // Log activity
      await CivicActivity.create({
        user_email: user.email,
        activity_type: 'module_completed',
        activity_id: moduleId,
        points_earned: pointsEarned
      });

      // Refresh user data
      const updatedUser = await User.me();
      setUser(updatedUser);
      setSelectedModule(null);
      setShowQuizDialog(false); // Close dialog on completion
    } catch (error) {
      console.error("Error completing module:", error);
    }
  };

  const handleModuleClick = (module) => {
    setSelectedModule(module);
    setShowQuizDialog(true);
  };

  const completedMissionIds = completedMissions.map(um => um.mission_id);
  const completedToday = completedMissions.length;

  const recommendedModules = modules.filter((m) => recommendedModuleIds.includes(m.id));
  const otherModules = modules.filter((m) => !recommendedModuleIds.includes(m.id));

  const filteredModules = filterCategory === 'all' ?
    otherModules :
    otherModules.filter((module) => module.category === filterCategory);

  const categories = [
    { id: 'all', label: 'All Modules' },
    { id: 'democracy_basics', label: 'Democracy Basics' },
    { id: 'voting', label: 'Voting' },
    { id: 'local_government', label: 'Local Government' },
    { id: 'rights_responsibilities', label: 'Rights & Responsibilities' },
    { id: 'civic_participation', label: 'Civic Participation' }];

  // Show customize button for all users
  const canCustomize = true;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) =>
              <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
            )}
          </div>
        </div>
      </div>);
  }

  // The ModuleViewer full-page rendering logic is removed as it's replaced by a modal dialog
  // if (selectedModule) {
  //   return (
  //     <ModuleViewer
  //       module={selectedModule}
  //       onComplete={handleModuleComplete}
  //       onBack={() => setSelectedModule(null)}
  //       isCompleted={user?.completed_modules?.includes(selectedModule.id)} />);
  // }

  return (
    <div className="bg-slate-100 mx-auto p-4 md:p-8 max-w-7xl">
      {/* Header */}
      <div className="relative rounded-xl overflow-hidden mb-8 p-8 h-64 flex flex-col justify-end" style={{ backgroundImage: "url('https://cdn.midjourney.com/81981e1c-921e-40bb-bf30-7d3d82cc9f3d/0_0.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="relative">
          <h1 className="text-4xl font-bold text-white mb-2">Civic Learning</h1>
          <p className="text-white/90 text-lg">
            Build your civic knowledge through hands-on lessons and interactive modules.
          </p>
        </div>
      </div>

      {/* Daily Missions Section */}
      <Card className="mb-8 shadow-lg border-0 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-yellow-600" />
              <div>
                <CardTitle className="text-xl text-yellow-900">Today's Missions</CardTitle>
                <p className="text-yellow-700">
                  Complete daily tasks to earn Civic Coins
                </p>
              </div>
            </div>
            <Link to={createPageUrl("Missions")}>
              <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Progress value={(completedToday / 3) * 100} className="h-2 mb-2" />
            <div className="flex justify-between text-sm text-yellow-700">
              <span>Daily Progress</span>
              <span>{completedToday}/3 missions completed</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {dailyMissions.length > 0 ? dailyMissions.map((mission, index) => (
              <div key={mission.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">
                    Mission {index + 1}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs font-medium text-yellow-600">
                    <Coins className="w-3 h-3" />
                    +{mission.coins_reward}
                  </div>
                </div>
                <h4 className="font-medium text-gray-900 mb-2 text-sm">{mission.title}</h4>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{mission.description}</p>
                <Button
                  asChild
                  size="sm"
                  disabled={completedMissionIds.includes(mission.id)}
                  className={`w-full text-xs ${
                    completedMissionIds.includes(mission.id)
                      ? 'bg-green-600 text-white'
                      : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                  }`}
                >
                  <Link to={createPageUrl("Missions")}>
                    {completedMissionIds.includes(mission.id) ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-3 h-3 mr-1" />
                        Start Now
                      </>
                    )}
                  </Link>
                </Button>
              </div>
            )) : (
              <div className="col-span-3 text-center py-6 text-yellow-600">
                <Target className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <p className="text-sm">No missions available today</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Section */}
      <RecommendedModules modules={recommendedModules} isLoading={isRecommending} onSelectModule={handleModuleClick} />

      {/* Progress Overview */}
      <Card className="mb-8 shadow-lg border-0 bg-gradient-to-r from-teal-50 to-emerald-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-teal-900">Your Learning Progress</CardTitle>
              <p className="text-teal-700 mt-1">
                {user?.completed_modules?.length || 0} of {modules.length} modules completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-teal-900">
                {user?.civic_score || 0} pts
              </div>
              <p className="text-sm text-teal-600">Civic Score</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress
            value={modules.length ? (user?.completed_modules?.length || 0) / modules.length * 100 : 0}
            className="h-3" />

        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) =>
            <Button
              key={category.id}
              variant={filterCategory === category.id ? "default" : "outline"}
              onClick={() => setFilterCategory(category.id)}
              className={filterCategory === category.id ?
                "bg-gradient-to-r from-teal-500 to-emerald-500 text-white" :
                "hover:bg-teal-50 hover:border-teal-200"
              }>

              {category.label}
            </Button>
          )}
        </div>
      </div>

      {/* All Modules Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Modules</h2>

      {/* Modules Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => {
          const isCompleted = user?.completed_modules?.includes(module.id);
          const CategoryIcon = categoryIcons[module.category] || BookOpen;

          return (
            <Card
              key={module.id}
              className={`shadow-lg border-0 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer relative ${
                isCompleted ? 'ring-2 ring-green-200 bg-green-50/50' : ''}`
              }
              onClick={() => handleModuleClick(module)}> {/* Updated onClick */}

              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden rounded-t-xl">
                {/* Customize Button - now shows for all users */}
                <div onClick={(e) => e.stopPropagation()}>
                  <ModuleCustomizer
                    module={module}
                    onUpdate={loadData}
                  />
                </div>

                {module.cover_image ? (
                  <img
                    src={module.cover_image}
                    alt={module.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center">
                    <CategoryIcon className="w-16 h-16 text-teal-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                {/* Badges overlaid on image */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <Badge variant="secondary" className="bg-white/90 text-gray-700 backdrop-blur-sm">
                    {module.difficulty}
                  </Badge>
                  {isCompleted && (
                    <Badge className="bg-green-600/90 text-white backdrop-blur-sm">
                      Completed
                    </Badge>
                  )}
                </div>

                {/* Completion checkmark */}
                {isCompleted && (
                  <div className="absolute top-3 left-3 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg leading-tight">
                  {module.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm line-clamp-3">
                  {module.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {module.duration_minutes}min
                    </span>
                    <span className="flex items-center gap-1">
                      <Coins className="w-4 h-4" /> {/* Changed icon from Trophy to Coins */}
                      +{module.points} coins {/* Changed text from pts to coins */}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card's onClick from firing
                    handleModuleClick(module); // Updated onClick
                  }}
                  className={`w-full ${
                    isCompleted ?
                      'bg-green-600 hover:bg-green-700' :
                      'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600'} text-white`
                  }>

                  {isCompleted ?
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Review
                    </> :

                    <>
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Start Module
                    </>
                  }
                </Button>
              </CardContent>
            </Card>);

        })}
      </div>

      {filteredModules.length === 0 &&
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-medium text-gray-500 mb-2">
            No modules found
          </h3>
          <p className="text-gray-400">
            Try selecting a different category or check back later
          </p>
        </div>
      }

      {/* Module Quiz Dialog */}
      <ModuleQuizDialog
        module={selectedModule}
        isOpen={showQuizDialog}
        onClose={() => {
          setShowQuizDialog(false);
          setSelectedModule(null);
        }}
        onComplete={handleModuleComplete}
        isCompleted={user?.completed_modules?.includes(selectedModule?.id)}
      />
    </div>);

}
