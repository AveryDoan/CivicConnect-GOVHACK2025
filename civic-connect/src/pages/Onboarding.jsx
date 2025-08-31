
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, MapPin, Globe, Heart, BookOpen, Calendar, Trophy, Sparkles } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const languages = [
  "English", "Mandarin", "Arabic", "Vietnamese", "Hindi", "Spanish"
];

const states = [
  "NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"
];

const interests = [
  { id: "environment", label: "Environment" },
  { id: "community_sports", label: "Community Sports" },
  { id: "arts_culture", label: "Arts & Culture" },
  { id: "local_business", label: "Local Business" },
  { id: "education", label: "Education" },
  { id: "health_wellness", label: "Health & Wellness" },
];

const goals = [
  { id: "understand_democracy", label: "Understand Australian democracy" },
  { id: "find_local_events", label: "Find local events & volunteering" },
  { id: "connect_community", label: "Connect with my community" },
  { id: "prepare_citizenship", label: "Prepare for citizenship test" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    preferred_language: "English",
    location: "",
    state: "",
    interests: [],
    goals: []
  });

  const handleNext = () => {
    if (step < 4) { // Changed from 3 to 4
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    try {
      await User.updateMyUserData({
        ...formData,
        onboarding_completed: true,
        civic_score: 0,
        badges_earned: [],
        completed_modules: []
      });
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field, value, checked) => {
    setFormData(prev => {
      const currentValues = prev[field] || [];
      if (checked) {
        return { ...prev, [field]: [...currentValues, value] };
      } else {
        return { ...prev, [field]: currentValues.filter(item => item !== value) };
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  i <= step 
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white' 
                    : 'bg-white border-2 border-gray-200 text-gray-400'
                }`}>
                  {i}
                </div>
                {i < 4 && (
                  <div className={`w-8 h-1 mx-2 rounded-full transition-all ${
                    i < step ? 'bg-gradient-to-r from-teal-500 to-emerald-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {step === 1 && <Heart className="w-8 h-8 text-white" />}
              {step === 2 && <Globe className="w-8 h-8 text-white" />}
              {step === 3 && <MapPin className="w-8 h-8 text-white" />}
              {step === 4 && <Sparkles className="w-8 h-8 text-white" />}
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {step === 1 && "Welcome to CivicConnect!"}
              {step === 2 && "Choose Your Language"}
              {step === 3 && "Where Are You Located?"}
              {step === 4 && "Personalize Your Journey"}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {step === 1 && "Let's help you get connected with your community and build civic confidence"}
              {step === 2 && "Select your preferred language for a better experience"}
              {step === 3 && "Help us find local events and opportunities near you"}
              {step === 4 && "Tell us what you're interested in for a personalized experience"}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="text-center">
                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-xl">
                    <BookOpen className="w-5 h-5 text-teal-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Learn by Doing</h4>
                      <p className="text-sm text-gray-600">Hands-on civic education and simulations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl">
                    <Calendar className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Connect Locally</h4>
                      <p className="text-sm text-gray-600">Find volunteering and community events</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl">
                    <Trophy className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Track Progress</h4>
                      <p className="text-sm text-gray-600">Earn badges and build civic confidence</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <Label htmlFor="language" className="text-base font-medium">Preferred Language</Label>
                <Select
                  value={formData.preferred_language}
                  onValueChange={(value) => updateFormData('preferred_language', value)}
                >
                  <SelectTrigger className="h-12 bg-white border-2 focus:border-teal-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  This helps us provide content in your preferred language
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="location" className="text-base font-medium">Suburb/Postcode</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateFormData('location', e.target.value)}
                    placeholder="e.g., Parramatta or 2150"
                    className="h-12 bg-white border-2 focus:border-teal-500 mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="text-base font-medium">State/Territory</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => updateFormData('state', value)}
                  >
                    <SelectTrigger className="h-12 bg-white border-2 focus:border-teal-500 mt-2">
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">What are your interests?</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {interests.map(interest => (
                      <div key={interest.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100">
                        <Checkbox
                          id={`interest-${interest.id}`}
                          checked={formData.interests.includes(interest.label)}
                          onCheckedChange={(checked) => handleCheckboxChange('interests', interest.label, checked)}
                        />
                        <label htmlFor={`interest-${interest.id}`} className="text-sm font-medium leading-none">
                          {interest.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-base font-medium">What are your main goals?</Label>
                   <div className="grid grid-cols-1 gap-2 mt-2">
                    {goals.map(goal => (
                      <div key={goal.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100">
                        <Checkbox
                          id={`goal-${goal.id}`}
                          checked={formData.goals.includes(goal.label)}
                          onCheckedChange={(checked) => handleCheckboxChange('goals', goal.label, checked)}
                        />
                        <label htmlFor={`goal-${goal.id}`} className="text-sm font-medium leading-none">
                          {goal.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleNext}
              disabled={step === 3 && (!formData.location || !formData.state)}
              className="w-full h-12 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-medium text-base"
            >
              {step === 4 ? "Complete Setup" : "Continue"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
