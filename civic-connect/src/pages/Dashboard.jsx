
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { LearningModule } from "@/api/entities";
import { LocalEvent } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Calendar, 
  Trophy, 
  Users, 
  ArrowRight,
  Star,
  MapPin,
  Clock
} from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [modules, setModules] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userData, moduleData, eventData] = await Promise.all([
        User.me(),
        LearningModule.list('-created_date', 3),
        LocalEvent.filter({ state: 'NSW' }, '-date', 3)
      ]);
      
      setUser(userData);
      setModules(moduleData);
      setEvents(eventData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getNextBadge = () => {
    const totalModules = user?.completed_modules?.length || 0;
    if (totalModules < 3) return "First Steps Badge";
    if (totalModules < 5) return "Active Learner Badge";
    if (totalModules < 10) return "Civic Champion Badge";
    return "Community Leader Badge";
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="relative rounded-xl overflow-hidden mb-8 p-8 h-64 flex flex-col justify-end" style={{backgroundImage: "url('https://cdn.midjourney.com/d85f2fe0-b9f4-4a66-8b45-fe16637eccf5/0_3.png')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="relative">
          <h1 className="text-4xl font-bold text-white mb-2">
            {getGreeting()}, {user?.full_name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-white/90 text-lg">
            Ready to continue your civic journey? Let's build stronger connections today.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200 border-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-teal-700">Civic Score</CardTitle>
            <Trophy className="w-5 h-5 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-900 mb-1">
              {user?.civic_score || 0}
            </div>
            <p className="text-sm text-teal-600">
              +{user?.completed_modules?.length * 10 || 0} this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-coral-50 to-pink-50 border-coral-200 border-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-coral-700">Modules Completed</CardTitle>
            <BookOpen className="w-5 h-5 text-coral-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-coral-900 mb-1">
              {user?.completed_modules?.length || 0}
            </div>
            <p className="text-sm text-coral-600">
              Next: {getNextBadge()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 border-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-yellow-700">Badges Earned</CardTitle>
            <Star className="w-5 h-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-900 mb-1">
              {user?.badges_earned?.length || 0}
            </div>
            <p className="text-sm text-yellow-600">
              Keep going!
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Learning Modules */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl">Continue Learning</CardTitle>
            </div>
            <Link to={createPageUrl("Learning")}>
              <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {modules.length > 0 ? modules.map((module) => (
              <div key={module.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{module.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                      {module.category?.replace(/_/g, ' ')}
                    </Badge>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {module.duration_minutes}min
                    </span>
                  </div>
                </div>
                <Button asChild size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                  <Link to={createPageUrl(`Learning?module_id=${module.id}`)}>Start</Link>
                </Button>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No learning modules available yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Local Events */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-coral-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl">Local Events</CardTitle>
            </div>
            <Link to={createPageUrl("LocalEvents")}>
              <Button variant="ghost" size="sm" className="text-coral-600 hover:text-coral-700">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {events.length > 0 ? events.map((event) => (
              <div key={event.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-coral-100 to-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-coral-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </span>
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No events found for your area</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Quick Actions</CardTitle>
          <p className="text-gray-600">Take your next step in civic engagement</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2 hover:bg-teal-50 hover:border-teal-200 transition-all"
              asChild
            >
              <Link to={createPageUrl("Learning")}>
                <BookOpen className="w-6 h-6 text-teal-600" />
                <span className="font-medium">Start Learning</span>
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2 hover:bg-coral-50 hover:border-coral-200 transition-all"
              asChild
            >
              <Link to={createPageUrl("LocalEvents")}>
                <Calendar className="w-6 h-6 text-coral-600" />
                <span className="font-medium">Find Events</span>
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2 hover:bg-yellow-50 hover:border-yellow-200 transition-all"
              asChild
            >
              <Link to={createPageUrl("Profile")}>
                <Trophy className="w-6 h-6 text-yellow-600" />
                <span className="font-medium">View Progress</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <style>{`
        .from-coral-50 { background: linear-gradient(to bottom right, #fff5f5, #fef7f7); }
        .to-pink-50 { background: linear-gradient(to bottom right, #fff5f5, #fdf2f8); }
        .border-coral-200 { border-color: #fed7d7; }
        .text-coral-700 { color: #c53030; }
        .text-coral-600 { color: #e53e3e; }
        .text-coral-900 { color: #742a2a; }
        .from-coral-500 { background: linear-gradient(to bottom right, #f56565, #ed64a6); }
        .to-pink-500 { background: linear-gradient(to bottom right, #f56565, #ed64a6); }
        .from-coral-100 { background: linear-gradient(to bottom right, #fed7d7, #fbb6ce); }
        .to-pink-100 { background: linear-gradient(to bottom right, #fed7d7, #fbb6ce); }
        .bg-coral-50 { background-color: #fff5f5; }
        .hover\\:border-coral-200:hover { border-color: #fed7d7; }
      `}</style>
    </div>
  );
}
