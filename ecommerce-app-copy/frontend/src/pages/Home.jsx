import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';
import OurPolicy from '../components/OurPolicy';
import NewsLetterBox from '../components/NewsLetterBox';
import AiChat from '../components/AiChat';
import { MessageSquare } from 'lucide-react'; // icon

const Home = () => {
  const [showChat, setShowChat] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  // Scroll bounce effect
  useEffect(() => {
    const handleScroll = () => {
      setIsBouncing(true);
      setTimeout(() => setIsBouncing(false), 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <NewsLetterBox />

      {/* Floating Message Icon */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-transform duration-500 ${isBouncing ? 'translate-y-[-5px]' : ''
          }`}
      >
        <button
          onClick={() => setShowChat(!showChat)}
          className="bg-black text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer"
        >
          <MessageSquare size={24} />
        </button>
      </div>

      {/* AI Chat Popup */}
      {showChat && (
        <div className="fixed bottom-20 right-6 z-50 w-[90%] max-w-md bg-gray-200 shadow-2xl border border-gray-700 rounded-xl overflow-hidden animate-fade-in">
          <div className="flex justify-between items-center px-4 py-2 bg-gray-200 ">
            {/* <span className="font-bold text-gray-700">Gemini AI</span> */}
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-500 hover:text-black cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="p-4 max-h-[400px] overflow-y-auto">
            <AiChat />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
