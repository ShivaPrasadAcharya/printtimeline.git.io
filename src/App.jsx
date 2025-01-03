import React, { useState, useRef } from 'react';

// Lucide Icons - All icons used across components
import { 
  Globe2, 
  Info, 
  Languages, 
  ChevronDown, 
  Download, 
  Eye, 
  EyeOff,
  FileText,
  Building,
  Scale,
  HeartHandshake,
  Laptop,
  BarChart,
  HelpCircle,
  ChevronRight,
  ListFilter,
  Menu,
  Camera 
} from 'lucide-react';

// UI Components from shadcn/ui
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle, 
  AlertDialog, 
  AlertDialogAction 
} from '@/components/ui/alert';

// Timeline Components
import Timeline from './components/timeline/Timeline';
import TimelineEntry from './components/timeline/TimelineEntry';
import IndexSection from './components/timeline/IndexSection';

// UI Components
import CategoryIcon from './components/icons/CategoryIcon';
import HighlightedText from './components/text/HighlightedText';
import SearchInput from './components/search/SearchInput';
import Header from './components/header/Header';
import MenuTrigger from './components/layout/MenuTrigger';

// Hooks
import { useSearch } from './hooks/useSearch';

// Data & Utils
import { timelineGroups } from './data/timelineData';
import { exportToPDF } from './utils/pdfExport';

// External libraries
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import _ from 'lodash';
import Papa from 'papaparse';
import * as mathjs from 'mathjs';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function App() {
  // State management
  const [language, setLanguage] = useState('en');
  const [activeTimeline, setActiveTimeline] = useState(Object.keys(timelineGroups)[0]);
  const [showContent, setShowContent] = useState(true);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  // Refs
  const timelineRef = useRef(null);

  // Search functionality using custom hook
  const {
    searchTerm,
    setSearchTerm,
    currentMatchIndex,
    matchCount,
    nextMatch,
    prevMatch
  } = useSearch(timelineGroups, activeTimeline);

  // Handle timeline change
  const handleTimelineChange = (newTimeline) => {
    setActiveTimeline(newTimeline);
    setSearchTerm('');  // Reset search when timeline changes
  };

  // Handle language change
  const handleLanguageChange = () => {
    setLanguage(prev => prev === 'en' ? 'ne' : 'en');
  };

  // Handle content visibility toggle
  const handleContentToggle = () => {
    setShowContent(prev => !prev);
  };

  // Handle PDF export
  const handleExport = async () => {
    if (timelineRef.current) {
      try {
        await exportToPDF(timelineRef.current, title[language]);
      } catch (error) {
        console.error('Error exporting PDF:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Menu Trigger */}
      <MenuTrigger onMouseEnter={() => setIsHeaderVisible(true)} />

      {/* Header with controls */}
      <Header
        isVisible={isHeaderVisible}
        onMouseLeave={() => setIsHeaderVisible(false)}
        language={language}
        setLanguage={handleLanguageChange}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTimeline={activeTimeline}
        setActiveTimeline={handleTimelineChange}
        showContent={showContent}
        setShowContent={handleContentToggle}
        timelineGroups={timelineGroups}
        matchCount={matchCount}
        currentMatchIndex={currentMatchIndex}
        prevMatch={prevMatch}
        nextMatch={nextMatch}
      />

      {/* Main content area */}
      <div className="px-4 py-6">
        {Object.values(timelineGroups).map((timeline) => (
          <Timeline
            key={timeline.id}
            ref={timelineRef}
            timelineData={timeline.data}
            title={timeline.title}
            index={timeline.index}
            language={language}
            isActive={activeTimeline === timeline.id}
            showContent={showContent}
            searchTerm={searchTerm}
            currentMatchIndex={currentMatchIndex}
            onExport={handleExport}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 w-full bg-white/90 backdrop-blur-sm border-t border-gray-200 py-2">
        <div className="max-w-7xl mx-auto px-4 text-right text-sm text-gray-600 italic">
          Shiva Prasad Acharya
          <br />
          Supreme Court (2081)
        </div>
      </div>
    </div>
  );
}

export default App;
