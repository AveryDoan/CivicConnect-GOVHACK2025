import {
  BookOpen,
  Vote,
  Users,
  Award,
  Trophy,
  Star,
  Calendar
} from "lucide-react";

export const badges = {
  democracy_explorer: {
    name: "Democracy Explorer",
    description: "Completed the 'Understanding Australian Democracy' module.",
    icon: BookOpen,
    color: "bg-blue-100 text-blue-600"
  },
  informed_voter: {
    name: "Informed Voter",
    description: "Completed the 'How Voting Works' module.",
    icon: Vote,
    color: "bg-purple-100 text-purple-600"
  },
  community_champion: {
    name: "Community Champion",
    description: "Completed the 'Your Local Council and You' module.",
    icon: Users,
    color: "bg-green-100 text-green-600"
  },
  responsible_citizen: {
    name: "Responsible Citizen",
    description: "Completed the 'Your Rights and Responsibilities' module.",
    icon: Award,
    color: "bg-yellow-100 text-yellow-600"
  },
  civic_leader: {
    name: "Civic Leader",
    description: "Completed the 'Making Your Voice Heard' module.",
    icon: Trophy,
    color: "bg-red-100 text-red-600"
  },
  first_event: {
    name: "Community Connector",
    description: "Attended your first community event.",
    icon: Calendar,
    color: "bg-pink-100 text-pink-600"
  },
  first_steps: {
    name: "First Steps",
    description: "Completed your first learning module.",
    icon: Star,
    color: "bg-teal-100 text-teal-600"
  }
};