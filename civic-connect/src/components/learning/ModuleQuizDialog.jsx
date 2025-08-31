import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  BookOpen, 
  Coins, 
  Trophy, 
  CheckCircle,
  Clock
} from "lucide-react";
import CoinAnimation from "../animations/CoinAnimation";

export default function ModuleQuizDialog({ 
  module, 
  isOpen, 
  onClose, 
  onComplete, 
  isCompleted 
}) {
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);

  // Sample quiz questions for each module
  const quizQuestions = {
    default: [
      {
        question: "I understand the key concepts covered in this module.",
        type: "checkbox",
        id: "understanding"
      },
      {
        question: "I can apply what I learned in real-life situations.",
        type: "checkbox", 
        id: "application"
      },
      {
        question: "I found this module helpful for my civic knowledge.",
        type: "checkbox",
        id: "helpful"
      }
    ]
  };

  const questions = quizQuestions[module?.category] || quizQuestions.default;

  const handleCheckboxChange = (questionId, checked) => {
    setSelectedAnswers(prev => {
      if (checked) {
        return [...prev, questionId];
      } else {
        return prev.filter(id => id !== questionId);
      }
    });
  };

  const handleComplete = async () => {
    if (selectedAnswers.length === 0) return;
    
    setIsSubmitting(true);
    
    // Call the completion handler
    await onComplete(module.id, module.points);
    
    // Show coin animation
    setShowCoinAnimation(true);
    
    setIsSubmitting(false);
  };

  const canSubmit = selectedAnswers.length > 0;

  if (!module) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold">{module.title}</div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {module.duration_minutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    +{module.points} points
                  </span>
                  <Badge variant="secondary">{module.difficulty}</Badge>
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Module Description */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">{module.description}</p>
            </div>

            {/* Quiz Questions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Complete the following to earn your coins:
              </h3>
              
              {questions.map((question, index) => (
                <div key={question.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id={question.id}
                    checked={selectedAnswers.includes(question.id)}
                    onCheckedChange={(checked) => handleCheckboxChange(question.id, checked)}
                    className="mt-1"
                  />
                  <Label 
                    htmlFor={question.id} 
                    className="text-sm font-medium leading-relaxed cursor-pointer"
                  >
                    {question.question}
                  </Label>
                </div>
              ))}
            </div>

            {/* Completion Reward */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <Coins className="w-5 h-5" />
                <span className="font-medium">
                  Complete to earn {module.points} Civic Coins!
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleComplete}
                disabled={!canSubmit || isSubmitting || isCompleted}
                className={`${
                  isCompleted 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600'
                } text-white`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                    Completing...
                  </>
                ) : isCompleted ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completed
                  </>
                ) : (
                  <>
                    <Coins className="w-4 h-4 mr-2" />
                    Complete Module (+{module.points} coins)
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Coin Animation */}
      <CoinAnimation 
        isVisible={showCoinAnimation}
        coinsEarned={module.points}
        onComplete={() => {
          setShowCoinAnimation(false);
          onClose(); // Close dialog after animation
        }}
      />
    </>
  );
}