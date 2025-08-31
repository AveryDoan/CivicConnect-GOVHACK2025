import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { badges } from "../lib/badges";

export default function BadgeGallery({ user }) {
  const earnedBadges = user?.badges_earned || [];
  
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl">Your Badges</CardTitle>
      </CardHeader>
      <CardContent>
        {earnedBadges.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {earnedBadges.map(badgeId => {
              const badge = badges[badgeId];
              if (!badge) return null;
              const Icon = badge.icon;
              return (
                <HoverCard key={badgeId}>
                  <HoverCardTrigger asChild>
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${badge.color}`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <p className="text-xs font-medium text-gray-700">{badge.name}</p>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-60">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${badge.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">{badge.name}</h4>
                        <p className="text-sm text-gray-500">{badge.description}</p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Start completing modules and attending events to earn badges!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}