import Layout from "./Layout.jsx";

import Onboarding from "./Onboarding";

import Dashboard from "./Dashboard";

import Learning from "./Learning";

import LocalEvents from "./LocalEvents";

import Profile from "./Profile";

import Missions from "./Missions";

import Shop from "./Shop";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Onboarding: Onboarding,
    
    Dashboard: Dashboard,
    
    Learning: Learning,
    
    LocalEvents: LocalEvents,
    
    Profile: Profile,
    
    Missions: Missions,
    
    Shop: Shop,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Onboarding />} />
                
                
                <Route path="/Onboarding" element={<Onboarding />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Learning" element={<Learning />} />
                
                <Route path="/LocalEvents" element={<LocalEvents />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/Missions" element={<Missions />} />
                
                <Route path="/Shop" element={<Shop />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}