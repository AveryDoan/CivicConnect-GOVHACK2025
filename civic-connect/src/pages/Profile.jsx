
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { CivicActivity } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit } from "lucide-react";
import Scorecard from "../components/profile/Scorecard";
import BadgeGallery from "../components/profile/BadgeGallery";
import ActivityFeed from "../components/profile/ActivityFeed";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userData, activityData] = await Promise.all([
        User.me(),
        CivicActivity.filter({}, '-created_date', 20)
      ]);
      setUser(userData);
      setActivities(activityData);
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
    setIsLoading(false);
  };
  
  if (isLoading) {
    return <div className="p-8">Loading profile...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Profile Header */}
      <Card className="relative rounded-xl overflow-hidden mb-8 shadow-lg border-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://cdn.midjourney.com/690bc447-f80d-4b83-ba85-70cc83c5869d/0_1.png')"}}></div>
        <div className="absolute inset-0 bg-black/50"></div>
        <CardContent className="relative p-6 flex flex-col md:flex-row items-center gap-6 text-white">
          <Avatar className="w-24 h-24 border-4 border-white/50 shadow-md">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.full_name}`} alt={user?.full_name} />
            <AvatarFallback>{user?.full_name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white">{user.full_name}</h1>
            <p className="text-white/80">{user.email}</p>
            <p className="text-sm text-white/70 mt-1">
              {user.location}, {user.state} | {user.preferred_language}
            </p>
          </div>
          <Button variant="outline" className="bg-transparent text-white border-white/50 hover:bg-white/10 hover:text-white"><Edit className="w-4 h-4 mr-2" /> Edit Profile</Button>
        </CardContent>
      </Card>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Scorecard */}
          <Scorecard user={user} />
          {/* Badges */}
          <BadgeGallery user={user} />
        </div>
        
        <div className="lg:col-span-1">
          {/* Activity Feed */}
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  );
}
