

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { Transaction } from "@/api/entities";
import { 
  Home, 
  BookOpen, 
  Calendar, 
  Trophy, 
  User as UserIcon,
  Menu,
  X,
  Loader2,
  Target,
  ShoppingCart,
  Coins,
  Settings,
  Edit,
  LogOut,
  ChevronDown,
  CheckCircle,
  PartyPopper
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import CongratulationEffect from "../components/animations/CongratulationEffect";

const navigationItems = [
  { title: "Dashboard", url: createPageUrl("Dashboard"), icon: Home },
  { title: "Learn", url: createPageUrl("Learning"), icon: BookOpen },
  { title: "Missions", url: createPageUrl("Missions"), icon: Target },
  { title: "Connect", url: createPageUrl("LocalEvents"), icon: Calendar },
  { title: "Shop", url: createPageUrl("Shop"), icon: ShoppingCart },
  { title: "Progress", url: createPageUrl("Profile"), icon: Trophy },
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastCheckin = localStorage.getItem('lastCheckinDate');
    if (lastCheckin === today) {
      setHasCheckedIn(true);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      return userData;
    } catch {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      setIsLoading(true);
      const userData = await fetchUser();
      if (userData && !userData.onboarding_completed && !location.pathname.includes('Onboarding')) {
        navigate(createPageUrl('Onboarding'));
      }
      setIsLoading(false);
    };

    checkAuthentication();
  }, [location.pathname, navigate]);

  const handleCheckIn = async () => {
    if (hasCheckedIn || !user) return; // Prevent check-in if already done or no user

    try {
      // Award 5 coins for check-in
      const newCoinBalance = (user.civic_coins || 0) + 5;
      await User.updateMyUserData({ civic_coins: newCoinBalance });

      await Transaction.create({
        user_email: user.email,
        transaction_type: 'bonus',
        amount: 5,
        description: 'Daily Check-in Bonus'
      });

      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem('lastCheckinDate', today);
      setHasCheckedIn(true);
      setShowCongrats(true);
      fetchUser(); // Refresh user data to show new coin balance
    } catch (error) {
      console.error("Error during check-in:", error);
      // Optionally, revert hasCheckedIn or show an error message
    }
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      setUser(null);
      navigate(createPageUrl('Dashboard')); // Refresh the page to show the login screen.
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // While checking authentication, show a loading screen.
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xl font-medium">Loading CivicConnect...</span>
        </div>
      </div>
    );
  }

  // If loading is finished and there is no user, show the login screen.
  // The Onboarding page is an exception, as it needs to be accessible
  // by a logged-in user who hasn't completed the flow.
  if (!user && !location.pathname.includes('Onboarding')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/e0d383394_civicconnectlogofinal.png" 
            alt="CivicConnect Logo" 
            className="w-40 mx-auto mb-6" 
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to CivicConnect</h1>
          <p className="text-gray-600 mb-8">
            Sign in to continue
          </p>
          <Button
            onClick={() => User.login()}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-medium py-3 text-base"
          >
            Sign In with Google
          </Button>
        </div>
      </div>
    );
  }

  // If the user is logged in (or on the onboarding page), show the main app.
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-blue-50">
      {/* Mobile Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3 md:hidden sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <Link to={createPageUrl("Dashboard")} className="flex items-center">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/e0d383394_civicconnectlogofinal.png" 
              alt="CivicConnect Logo" 
              className="h-8 w-auto" 
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = 'block';
                }
              }}
            />
            <span className="hidden text-xl font-bold text-teal-600 ml-2">CivicConnect</span>
          </Link>
          
          <div className="flex items-center gap-2">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.full_name}`} />
                      <AvatarFallback className="text-xs">{user?.full_name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.full_name}</p>
                    <p className="text-xs text-gray-500">{user?.civic_coins || 0} Civic Coins</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl("Profile")} className="flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl("Shop")} className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 py-4">
            <nav className="px-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.url
                      ? 'bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:flex-col md:w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <div className="mb-8">
              <Link to={createPageUrl("Dashboard")} className="flex items-center justify-center">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/e0d383394_civicconnectlogofinal.png" 
                  alt="CivicConnect Logo" 
                  className="h-12 w-auto max-w-full" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = 'block';
                    }
                  }}
                />
                <span className="hidden text-2xl font-bold text-teal-600">CivicConnect</span>
              </Link>
            </div>
            
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    location.pathname === item.url
                      ? 'bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    location.pathname === item.url ? 'text-teal-600' : ''
                  }`} />
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>

          {user && (
            <div className="mt-auto p-6 border-t border-gray-200 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl">
                <Coins className="w-5 h-5 text-yellow-600" />
                <div>
                  <div className="text-sm font-medium text-yellow-900">
                    {user?.civic_coins || 0} Civic Coins
                  </div>
                  <div className="text-xs text-yellow-600">Available to spend</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 md:overflow-hidden">
          {/* Desktop Header with Profile Menu */}
          <header className="hidden md:flex bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 justify-end sticky top-0 z-50">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.full_name}`} />
                      <AvatarFallback>{user?.full_name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden lg:block">
                      <div className="text-sm font-medium">{user?.full_name}</div>
                      <div className="text-xs text-gray-500">{user?.civic_coins || 0} Civic Coins</div>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl("Profile")} className="flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl("Shop")} className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </header>

          <main className="h-full overflow-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Daily Check-in Button */}
      {user && !location.pathname.includes('Onboarding') && ( // Only show if user is logged in and not on onboarding
        <Button
          onClick={handleCheckIn}
          disabled={hasCheckedIn}
          className={cn(
            "fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center",
            hasCheckedIn
              ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white cursor-not-allowed"
              : "bg-gradient-to-br from-yellow-400 to-orange-500 text-white hover:scale-110"
          )}
          title={hasCheckedIn ? "Checked in for today!" : "Daily Check-in"}
        >
          {hasCheckedIn ? (
            <CheckCircle className="w-7 h-7" />
          ) : (
            <PartyPopper className="w-7 h-7" />
          )}
        </Button>
      )}

      {/* Survey Feedback Button */}
      <Button
        onClick={() => window.open('https://tally.so/r/w5JEBE', '_blank')}
        className="fixed bottom-6 right-6 z-50 h-12 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium shadow-lg transition-all duration-300 hover:scale-105 rounded-full"
        title="Share your feedback"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Feedback
      </Button>

      {/* Congratulations Effect */}
      <CongratulationEffect
        isVisible={showCongrats}
        onComplete={() => setShowCongrats(false)}
        title="Check-in Complete!"
        message="You've earned +5 Civic Coins! Keep it up!"
      />
    </div>
  );
}

