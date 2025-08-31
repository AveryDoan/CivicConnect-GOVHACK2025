import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Coins, 
  CheckCircle, 
  PlayCircle, 
  BookOpen, 
  MessageSquare, 
  Brain 
} from "lucide-react";
import CoinAnimation from "../animations/CoinAnimation";

const missionIcons = {
  quiz: Brain,
  article: BookOpen,
  reflection: MessageSquare
};

export default function MissionCard({ mission, isCompleted, onComplete, missionNumber }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [reflectionText, setReflectionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);

  const Icon = missionIcons[mission.mission_type] || PlayCircle;

  const handleComplete = async () => {
    setIsSubmitting(true);
    const userResponse = mission.mission_type === 'reflection' 
      ? { reflection: reflectionText }
      : { answer: selectedAnswer };
    
    await onComplete(mission, userResponse);
    setIsDialogOpen(false);
    setIsSubmitting(false);
    
    // Show coin animation
    setShowCoinAnimation(true);
  };

  const canSubmit = () => {
    if (mission.mission_type === 'reflection') return reflectionText.trim().length > 10;
    if (mission.mission_type === 'quiz') return selectedAnswer;
    return true; // For article missions
  };

  return (
    <>
      <Card className={`shadow-lg border-0 transition-all duration-200 hover:shadow-xl ${
        isCompleted 
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 border-2' 
          : 'bg-white/80 backdrop-blur-sm hover:-translate-y-1'
      }`}>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
              Mission {missionNumber}
            </Badge>
            <div className="flex items-center gap-1 text-sm font-medium text-yellow-600">
              <Coins className="w-4 h-4" />
              +{mission.coins_reward}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isCompleted ? 'bg-green-100' : 'bg-teal-100'
            }`}>
              {isCompleted ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Icon className="w-5 h-5 text-teal-600" />
              )}
            </div>
            <CardTitle className="text-lg">{mission.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm mb-4">{mission.description}</p>
          
          <Button 
            onClick={() => setIsDialogOpen(true)}
            disabled={isCompleted}
            className={`w-full ${
              isCompleted 
                ? 'bg-green-600 text-white' 
                : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Completed
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4 mr-2" />
                Start Mission
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon className="w-5 h-5 text-teal-600" />
              {mission.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {mission.mission_type === 'quiz' && (
              <div>
                <p className="text-gray-700 mb-4">{mission.content?.question}</p>
                <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                  {mission.content?.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {mission.mission_type === 'article' && (
              <div>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{mission.content?.article_text}</p>
                </div>
              </div>
            )}

            {mission.mission_type === 'reflection' && (
              <div>
                <p className="text-gray-700 mb-4">{mission.content?.question}</p>
                <Textarea
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="min-h-[100px]"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Minimum 10 characters required
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleComplete}
                disabled={!canSubmit() || isSubmitting}
                className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white"
              >
                {isSubmitting ? "Completing..." : `Complete (+${mission.coins_reward} coins)`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Coin Animation */}
      <CoinAnimation 
        isVisible={showCoinAnimation}
        coinsEarned={mission.coins_reward}
        onComplete={() => setShowCoinAnimation(false)}
      />
    </>
  );
}