import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { BookOpen, Calendar, Star } from "lucide-react";

const activityIcons = {
  module_completed: { icon: BookOpen, color: 'text-teal-600', bg: 'bg-teal-50' },
  event_attended: { icon: Calendar, color: 'text-coral-600', bg: 'bg-coral-50' },
  simulation_completed: { icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
};

const activityText = {
  module_completed: (points) => `Completed a learning module and earned ${points} points.`,
  event_attended: (points) => `Attended a local event and earned ${points} points.`,
  simulation_completed: (points) => `Finished a simulation and earned ${points} points.`,
};

export default function ActivityFeed({ activities }) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="text-xl">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.length > 0 ? activities.map(activity => {
            const config = activityIcons[activity.activity_type] || activityIcons.module_completed;
            const Icon = config.icon;
            const text = activityText[activity.activity_type] ? activityText[activity.activity_type](activity.points_earned) : `Completed an activity and earned ${activity.points_earned} points.`;
            return (
              <div key={activity.id} className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${config.bg}`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-800">{text}</p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.created_date))} ago
                  </p>
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-8 text-gray-500">
              <p>Your recent activities will show up here.</p>
            </div>
          )}
        </div>
      </CardContent>
      <style>{`
        .bg-coral-50 { background-color: #fff5f5; }
        .text-coral-600 { color: #e53e3e; }
      `}</style>
    </Card>
  );
}