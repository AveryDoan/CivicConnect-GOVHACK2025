import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Coins, TrendingUp } from "lucide-react";

export default function CoinDisplay({ user }) {
  return (
    <Card className="mb-8 shadow-lg border-0 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {user?.civic_coins || 0} Civic Coins
              </div>
              <p className="text-yellow-100">Your current balance</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-yellow-100">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">+{33 * (3 - (user?.missions_completed_today || 0))} coins available today</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}