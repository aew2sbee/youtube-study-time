import { useState, useEffect } from 'react';
import Image from 'next/image';
import { StudyTimeUser } from '@/types/youtube';
import { STUDY_PROGRESS } from '@/constants/studyProgress';
import { getWeekVisitStamps } from '@/utils/visitStampUtils';

interface StudyTimeDisplayProps {
  users: StudyTimeUser[];
  formatTime: (seconds: number) => string;
  lastUpdateTime: Date;
  formatUpdateTime: (date: Date) => string;
}


export const StudyTimeDisplay = ({
  users,
  formatTime,
  lastUpdateTime,
  formatUpdateTime,
}: StudyTimeDisplayProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showProgressMessage, setShowProgressMessage] = useState(false);
  const usersPerPage = 3;
  const totalPages = Math.ceil(users.length / usersPerPage);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (totalPages <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPage(prev => {
          const nextPage = (prev + 1) % totalPages;
          if (nextPage === 0) {
            setShowProgressMessage(true);
            setTimeout(() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setShowProgressMessage(false);
                setIsTransitioning(false);
              }, 1000);
            }, 4000);
          }
          return nextPage;
        });
        setIsTransitioning(false);
      }, 1000);
    }, 10000);

    return () => clearInterval(interval);
  }, [totalPages]);

  const displayedUsers = users.slice(
    currentPage * usersPerPage,
    (currentPage + 1) * usersPerPage
  );

  // Get current week's Monday as start date
  const getCurrentWeekStart = (): string => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ...
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to Monday-based week
    const monday = new Date(now);
    monday.setDate(now.getDate() - mondayOffset);
    return monday.toISOString().split('T')[0];
  };
  
  const weekVisitStamps = getWeekVisitStamps(users, getCurrentWeekStart());
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="w-screen h-screen p-2 flex justify-start items-center">
      <div className="w-full max-w-2xl flex flex-col justify-start h-full">
        <div className="p-4 mb-2 min-h-fit mt-[50vh] transform translate-y-6">
          {showProgressMessage ? (
            <div className={`transition-opacity duration-1000 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              <div className="flex justify-between items-center mb-2 w-full">
                <h1 className="text-2xl font-bold text-white max-w-[70%] truncate">
                  {STUDY_PROGRESS.title}
                </h1>
                <div className="text-white text-lg whitespace-nowrap">
                  {STUDY_PROGRESS.updateDate}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="px-3 py-2 bg-white/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm">
                          📚
                        </div>
                        <span className="text-white font-medium" style={{fontSize: '24px'}}>
                          Total Study Time
                        </span>
                      </div>
                      <div className="text-white font-bold" style={{fontSize: '24px'}}>
                        {STUDY_PROGRESS.totalTime}
                      </div>
                    </div>
                  </div>

                  <div className="px-3 py-2 bg-white/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm">
                          📅
                        </div>
                        <span className="text-white font-medium" style={{fontSize: '24px'}}>
                          Exam Date
                        </span>
                      </div>
                      <div className="text-white font-bold" style={{fontSize: '24px'}}>
                        {STUDY_PROGRESS.examDate}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="px-3 py-2 bg-white/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-sm">
                          🎯
                        </div>
                        <span className="text-white font-medium" style={{fontSize: '24px'}}>
                          Test Score
                        </span>
                      </div>
                      <div className="text-white font-bold" style={{fontSize: '24px'}}>
                        {STUDY_PROGRESS.testScore}
                      </div>
                    </div>
                  </div>

                  <div className="px-3 py-2 bg-white/10 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm">
                          🏪
                        </div>
                        <span className="text-white font-medium" style={{fontSize: '24px'}}>
                          Weekly Visits
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 ml-11">
                      {dayNames.map((day, index) => (
                        <div key={day} className="text-center">
                          <div className="text-xs text-gray-300 mb-0.5">
                            {day}
                          </div>
                          <div className={`text-xs rounded px-1 py-0.5 ${
                            weekVisitStamps[index] ? 'bg-yellow-500 text-black' : 'bg-white/20 text-white'
                          }`}>
                            {weekVisitStamps[index] ? '🏪' : '-'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-4xl font-bold text-white">
                  Study Time Tracker
                </h1>
                <div className="text-white text-2xl">
                  Updated: {mounted ? formatUpdateTime(lastUpdateTime) : '--:--'}
                </div>
              </div>
              
              <div className="flex flex-col">
                {displayedUsers.length === 0 ? (
                  <div className="text-white text-center text-2xl flex-1 flex items-center justify-center">
                    Waiting for comments...
                  </div>
                ) : (
                  <div className={`space-y-3 flex-1 transition-opacity duration-1000 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                    {displayedUsers.map((user) => (
                      <div
                        key={user.name}
                        className="flex items-center justify-between px-3 py-2"
                      >
                        <div className="flex items-center space-x-4">
                          <Image
                            src={user.profileImageUrl}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full"
                          />
                          <span className="text-white font-medium truncate max-w-[300px]" style={{fontSize: '40px'}}>
                            {user.name}
                          </span>
                        </div>
                        
                        <div className="text-white font-bold flex items-center space-x-3" style={{fontSize: '40px'}}>
                          {user.isStudying ? (
                            <span className="text-green-400 animate-pulse w-24 text-center" style={{fontSize: '24px'}}>Studying</span>
                          ) : user.studyTime > 0 ? (
                            <span className="text-blue-400 w-24 text-center" style={{fontSize: '24px'}}>Finished</span>
                          ) : null}
                          {user.hasVisitStamp && (
                            <span className="text-yellow-400 mr-2" style={{fontSize: '30px'}}>🏪</span>
                          )}
                          <span>{formatTime(user.studyTime)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {totalPages > 1 && (
                  <div className="text-white text-center mt-3 text-xl">
                    {currentPage + 1} / {totalPages}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};