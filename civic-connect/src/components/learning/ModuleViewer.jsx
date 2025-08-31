import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Trophy, 
  BookOpen,
  Award,
  Quote,
  Lightbulb
} from "lucide-react";

const SectionRenderer = ({ section }) => {
  switch (section.type) {
    case 'header':
      return <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-4 md:mt-6 mb-2 md:mb-3">{section.content}</h2>;
    case 'paragraph':
      return <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed mb-3 md:mb-4">{section.content}</p>;
    case 'image':
      return (
        <div className="my-4 md:my-6">
          <img src={section.content} alt={section.caption || 'Module image'} className="rounded-lg shadow-lg w-full" />
          {section.caption && <p className="text-center text-xs md:text-sm text-gray-500 mt-2">{section.caption}</p>}
        </div>
      );
    case 'video':
      return (
        <div className="my-4 md:my-6">
          <div className="relative w-full" style={{paddingBottom: '56.25%'}}>
            <iframe 
              src={section.content} 
              title={section.caption || 'Module video'} 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
            ></iframe>
          </div>
          {section.caption && <p className="text-center text-xs md:text-sm text-gray-500 mt-2">{section.caption}</p>}
        </div>
      );
    case 'quote':
      return (
        <blockquote className="my-4 md:my-6 p-3 md:p-4 border-l-4 border-teal-500 bg-teal-50 italic text-teal-800">
          <Quote className="w-4 h-4 md:w-5 md:h-5 inline-block mr-2" />
          <span className="text-sm md:text-base">{section.content}</span>
        </blockquote>
      );
    case 'didYouKnow':
      return (
        <div className="my-4 md:my-6 p-3 md:p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3 md:gap-4">
          <Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-sm md:text-base font-bold text-yellow-800">Did You Know?</h4>
            <p className="text-sm md:text-base text-yellow-700">{section.content}</p>
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default function ModuleViewer({ module, onComplete, onBack, isCompleted }) {
  const [currentSection, setCurrentSection] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  const sections = module.content || [];
  const totalSections = sections.length;

  const handleNext = () => {
    if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1);
    } else if (!isCompleted) {
      setShowCompletion(true);
    }
  };

  const handleComplete = () => {
    onComplete(module.id, module.points);
  };

  const progress = totalSections > 0 ? ((currentSection + 1) / totalSections) * 100 : 0;

  if (showCompletion) {
    return (
      <div className="p-3 md:p-8 max-w-4xl mx-auto">
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6 md:p-12 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <Trophy className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
              Congratulations! 🎉
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-4 md:mb-6">
              You've completed "{module.title}"
            </p>
            <div className="bg-white rounded-2xl p-4 md:p-6 mb-6 md:mb-8 shadow-lg">
              <div className="flex items-center justify-center gap-4 md:gap-8">
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-green-600">+{module.points}</div>
                  <p className="text-xs md:text-sm text-gray-600">Points Earned</p>
                </div>
                <div className="w-px h-8 md:h-12 bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-purple-600">
                    <Award className="w-6 h-6 md:w-8 md:h-8 mx-auto" />
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">Badge Progress</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
              <Button variant="outline" onClick={onBack} className="px-6 md:px-8">
                Back to Learning
              </Button>
              <Button 
                onClick={handleComplete}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 md:px-8"
              >
                Claim Rewards
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-3 md:mb-4 hover:bg-gray-100 -ml-2 md:ml-0"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Learning
        </Button>
        
        <div className="mb-4">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
            {module.title}
          </h1>
          <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">{module.description}</p>
          
          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 md:w-4 md:h-4" />
              {module.duration_minutes} minutes
            </span>
            <span className="flex items-center gap-1">
              <Trophy className="w-3 h-3 md:w-4 md:h-4" />
              {module.points} points
            </span>
            <Badge variant="secondary" className="text-xs">
              {module.difficulty}
            </Badge>
            {isCompleted && (
              <Badge className="bg-green-100 text-green-700 flex items-center gap-1 text-xs">
                <CheckCircle className="w-3 h-3" />
                Completed
              </Badge>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs md:text-sm text-gray-600">
            <span>Progress</span>
            <span>Section {currentSection + 1} of {totalSections}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-4 md:mb-6">
        <CardHeader className="border-b bg-gradient-to-r from-teal-50 to-emerald-50 p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-teal-900 text-lg md:text-xl">
            <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
            Learning Content
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 lg:p-8">
          <div className="prose prose-sm md:prose-base max-w-none">
            {sections.length > 0 ? (
              <SectionRenderer section={sections[currentSection]} />
            ) : (
              <p className="text-gray-500 text-center py-8">This module has no content available.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          disabled={currentSection === 0}
          size="sm"
          className="px-3 md:px-4"
        >
          Previous
        </Button>

        <div className="flex items-center gap-1 md:gap-2">
          {Array.from({ length: totalSections }, (_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-colors ${
                i <= currentSection ? 'bg-teal-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-3 md:px-4"
          size="sm"
        >
          {currentSection === totalSections - 1 
            ? (isCompleted ? 'Review Complete' : 'Complete Module')
            : 'Next'
          }
        </Button>
      </div>
    </div>
  );
}