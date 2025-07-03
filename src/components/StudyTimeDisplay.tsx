import { useState, useEffect } from 'react';
import Image from 'next/image';
import { StudyTimeUser } from '@/types/youtube';

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

  return (
    <div className="w-screen h-screen p-2 flex justify-start items-center">
      <div className="w-full max-w-2xl flex flex-col justify-start h-full">
        <div className="p-4 mb-2 min-h-fit mt-[50vh] transform translate-y-6">
          {showProgressMessage ? (
            <div className={`text-white text-center space-y-4 transition-opacity duration-1000 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              <h2 className="text-4xl font-bold text-white text-center mb-4">Progress on 基本情報技術者試験</h2>
              <div className="mb-4" style={{fontSize: '30px'}}>Update Date: 2025/07/02</div>
              <div className="max-w-4xl mx-auto">
                <table className="w-full text-left border-collapse">
                  <tbody style={{fontSize: '30px'}}>
                    <tr className="border-b border-gray-600">
                      <td className="py-2 px-4 font-medium">Total Time:</td>
                      <td className="py-2 px-4">20 hour 0min</td>
                    </tr>
                    <tr className="border-b border-gray-600">
                      <td className="py-2 px-4 font-medium">Exam Date:</td>
                      <td className="py-2 px-4">Not scheduled yet</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-medium">Test Score:</td>
                      <td className="py-2 px-4">科目A: 62%, 科目B: 95%</td>
                    </tr>
                  </tbody>
                </table>
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