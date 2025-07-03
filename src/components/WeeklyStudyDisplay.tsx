'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { WeeklyStudyData } from '@/types/youtube';
import { getWeekDateRange } from '@/utils/weeklyStudyUtils';
import { STUDY_PROGRESS } from '@/constants/studyProgress';

interface WeeklyStudyDisplayProps {
  getWeeklyData: (targetDate?: Date) => WeeklyStudyData;
  formatTime: (seconds: number) => string;
  lastUpdateTime: Date;
  formatUpdateTime: (date: Date) => string;
}

export default function WeeklyStudyDisplay({ getWeeklyData, formatTime, lastUpdateTime, formatUpdateTime }: WeeklyStudyDisplayProps) {
  const [weeklyData, setWeeklyData] = useState<WeeklyStudyData>(() => getWeeklyData());
  const [currentPage, setCurrentPage] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showProgressMessage, setShowProgressMessage] = useState(false);
  
  const usersPerPage = 3;
  const totalPages = Math.ceil(weeklyData.users.length / usersPerPage);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setWeeklyData(getWeeklyData());
  }, [getWeeklyData]);

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

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const displayedUsers = weeklyData.users.slice(
    currentPage * usersPerPage,
    (currentPage + 1) * usersPerPage
  );

  return (
    <div className="w-screen h-screen p-2 flex justify-start items-end">
      <div className="w-full max-w-2xl flex flex-col justify-end h-full">
        <div className="p-4 mb-2 min-h-fit">
          {showProgressMessage ? (
            <div className={`text-white text-center space-y-4 transition-opacity duration-1000 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              <h2 className="text-4xl font-bold text-white text-center mb-4">{STUDY_PROGRESS.title}</h2>
              <div className="mb-4" style={{fontSize: '30px'}}>Update Date: {STUDY_PROGRESS.updateDate}</div>
              <div className="max-w-4xl mx-auto">
                <table className="w-full text-left border-collapse">
                  <tbody style={{fontSize: '30px'}}>
                    <tr className="border-b border-gray-600">
                      <td className="py-2 px-4 font-medium">Total Time:</td>
                      <td className="py-2 px-4">{STUDY_PROGRESS.totalTime}</td>
                    </tr>
                    <tr className="border-b border-gray-600">
                      <td className="py-2 px-4 font-medium">Exam Date:</td>
                      <td className="py-2 px-4">{STUDY_PROGRESS.examDate}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-medium">Test Score:</td>
                      <td className="py-2 px-4">{STUDY_PROGRESS.testScore}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-4xl font-bold text-white">
                  Weekly Study Time
                </h1>
                <div className="text-white text-2xl">
                  Updated: {mounted ? formatUpdateTime(lastUpdateTime) : '--:--'}
                </div>
              </div>
              
              <div className="text-center mb-3">
                <h2 className="text-3xl text-white font-semibold">
                  {getWeekDateRange(weeklyData.weekStart)}
                </h2>
              </div>
              
              <div className="flex flex-col">
                {displayedUsers.length === 0 ? (
                  <div className="text-white text-center text-2xl flex-1 flex items-center justify-center">
                    Waiting for comments...
                  </div>
                ) : (
                  <div className={`space-y-2 flex-1 transition-opacity duration-1000 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                    {displayedUsers.map((user) => (
                      <div key={user.name} className="px-3 py-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-4">
                            <Image
                              src={user.profileImageUrl}
                              alt={user.name}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full"
                            />
                            <span className="text-white font-medium truncate max-w-[300px]" style={{fontSize: '32px'}}>
                              {user.name}
                            </span>
                          </div>
                          
                          <div className="text-white font-bold" style={{fontSize: '40px'}}>
                            {formatTime(user.totalStudyTime)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-7 gap-1 ml-14">
                          {user.dailyStudyTime.map((day, index) => (
                            <div key={day.date} className="text-center">
                              <div className="text-xs text-gray-300 mb-0.5">
                                {dayNames[index]}
                              </div>
                              <div className="text-sm text-white bg-white/20 rounded px-1 py-0.5">
                                {day.studyTime > 0 ? formatTime(day.studyTime) : '-'}
                              </div>
                            </div>
                          ))}
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
}