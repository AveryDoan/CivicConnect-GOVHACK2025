import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, PlayCircle, Clock } from "lucide-react";

export default function RecommendedModules({ modules, isLoading, onSelectModule }) {
  if (isLoading) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          Finding Recommendations for You...
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!modules || modules.length === 0) {
    return null; // Don't render the section if there are no recommendations
  }

  return (
    <div className="mb-12">
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-3 text-purple-900">
            <Sparkles className="w-6 h-6" />
            Recommended for You
          </CardTitle>
          <p className="text-purple-700">Based on your interests and goals.</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {modules.map(module => (
              <div 
                key={module.id} 
                className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onSelectModule(module)}
              >
                <h3 className="font-bold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{module.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <Badge variant="secondary">{module.category.replace(/_/g, ' ')}</Badge>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{module.duration_minutes}min</span>
                </div>
                <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                  <PlayCircle className="w-4 h-4 mr-2" /> Start Now
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}