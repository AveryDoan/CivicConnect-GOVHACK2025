
import React, { useState, useEffect, useCallback } from "react";
import { LocalEvent } from "@/api/entities";
import { User } from "@/api/entities";
import { CivicActivity } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  Check,
  Award
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const states = ["All", "NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"];
const eventTypes = ["All", "volunteering", "community_event", "council_meeting", "cultural_event", "workshop"];

export default function LocalEvents() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ state: 'All', type: 'All' });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);

      const filterQuery = {};
      if (filters.state !== 'All') filterQuery.state = filters.state;
      if (filters.type !== 'All') filterQuery.event_type = filters.type;

      const [eventData, activityData] = await Promise.all([
        LocalEvent.filter(filterQuery, '-date'),
        CivicActivity.filter({ user_email: userData.email, activity_type: 'event_attended' })
      ]);

      setEvents(eventData);
      setActivities(activityData);
    } catch (error) {
      console.error("Error loading event data:", error);
    }
    setIsLoading(false);
  }, [filters]); // Added filters to useCallback dependencies

  useEffect(() => {
    loadData();
  }, [loadData]); // useEffect now depends on the memoized loadData function


  const handleLogAttendance = async (event) => {
    try {
      // Create activity record
      await CivicActivity.create({
        user_email: user.email,
        activity_type: 'event_attended',
        activity_id: event.id,
        points_earned: event.points
      });

      // Update user score
      const newScore = (user.civic_score || 0) + event.points;
      await User.updateMyUserData({ civic_score: newScore });

      // Refresh data
      loadData();
    } catch (error) {
      console.error("Error logging attendance:", error);
    }
  };

  const hasAttended = (eventId) => {
    return activities.some(act => act.activity_id === eventId);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative rounded-xl overflow-hidden mb-8 p-8 h-64 flex flex-col justify-end" style={{backgroundImage: "url('https://cdn.midjourney.com/0e961557-555e-471a-b769-98cf33b43f03/0_2.png')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="relative">
          <h1 className="text-4xl font-bold text-white mb-2">Connect with Your Community</h1>
          <p className="text-white/90 text-lg">
            Find local events, volunteering opportunities, and council meetings near you.
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Filter Events</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-gray-700 mb-1 block">State/Territory</label>
            <Select value={filters.state} onValueChange={(value) => setFilters(prev => ({...prev, state: value}))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {states.map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Event Type</label>
            <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({...prev, type: value}))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? Array(6).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse h-64 bg-gray-200"></Card>
        )) : events.map(event => (
          <Card key={event.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge className={`bg-coral-100 text-coral-700`}>
                  {event.event_type.replace(/_/g, ' ')}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-yellow-600 font-medium">
                  <Award className="w-4 h-4" /> +{event.points} pts
                </div>
              </div>
              <CardTitle className="text-lg">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {event.description}
              </p>
              <div className="text-sm text-gray-500 space-y-2">
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {event.location}, {event.state}</div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(event.date).toLocaleDateString()}</div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {event.time}</div>
                <div className="flex items-center gap-2"><Users className="w-4 h-4" /> Organized by {event.organizer}</div>
              </div>
            </CardContent>
            <div className="p-4 pt-0">
              {hasAttended(event.id) ? (
                <Button disabled className="w-full bg-green-600">
                  <Check className="w-4 h-4 mr-2" /> Attended
                </Button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-coral-500 to-pink-500 text-white">Log Attendance</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Log your attendance?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Confirming will add {event.points} points to your Civic Score. Please only do this if you actually attended the event.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleLogAttendance(event)}>
                        Confirm Attendance
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </Card>
        ))}
      </div>
      {!isLoading && events.length === 0 && (
         <div className="text-center py-12 col-span-full">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">
              No events match your filters
            </h3>
            <p className="text-gray-400">
              Try expanding your search or check back later!
            </p>
          </div>
      )}
      <style>{`
        .bg-coral-100 { background-color: #fff5f5; }
        .text-coral-700 { color: #c53030; }
        .from-coral-500 { background-image: linear-gradient(to right, #f56565, #ed64a6); }
        .to-pink-500 { background-image: linear-gradient(to right, #f56565, #ed64a6); }
      `}</style>
    </div>
  );
}
