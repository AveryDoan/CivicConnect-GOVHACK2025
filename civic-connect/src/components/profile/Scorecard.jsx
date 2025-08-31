import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, BookOpen, Calendar } from "lucide-react";

export default function Scorecard({ user }) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl">Your Civic Scorecard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl text-center">
            <Trophy className="w-10 h-10 mx-auto mb-3 text-teal-600" />
            <div className="text-3xl font-bold text-teal-900">{user?.civic_score || 0}</div>
            <p className="text-sm font-medium text-teal-700">Total Civic Score</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-coral-50 to-pink-50 rounded-xl text-center">
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-coral-600" />
            <div className="text-3xl font-bold text-coral-900">{user?.completed_modules?.length || 0}</div>
            <p className="text-sm font-medium text-coral-700">Modules Completed</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl text-center">
            <Calendar className="w-10 h-10 mx-auto mb-3 text-yellow-600" />
            <div className="text-3xl font-bold text-yellow-900">{user?.attended_events_count || 0}</div>
            <p className="text-sm font-medium text-yellow-700">Events Attended</p>
          </div>
        </div>
      </CardContent>
      <style>{`
        .from-coral-50 { background-color: #fff5f5; }
        .to-pink-50 { background-color: #fdf2f8; }
        .text-coral-600 { color: #e53e3e; }
        .text-coral-900 { color: #742a2a; }
        .text-coral-700 { color: #c53030; }
      `}</style>
    </Card>
  );
}