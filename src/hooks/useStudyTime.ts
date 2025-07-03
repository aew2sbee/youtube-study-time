import { useState } from 'react';
import { StudyTimeUser, WeeklyStudyData } from '@/types/youtube';
import { calculateWeeklyStudyData, formatDateString } from '@/utils/weeklyStudyUtils';

// Mock data for testing
const createMockUsers = (): Map<string, StudyTimeUser> => {
  const mockUsers = new Map<string, StudyTimeUser>();
  
  const today = formatDateString(new Date());
  const yesterday = formatDateString(new Date(Date.now() - 24 * 60 * 60 * 1000));
  const twoDaysAgo = formatDateString(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000));
  const threeDaysAgo = formatDateString(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000));
  const fourDaysAgo = formatDateString(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000));
  const fiveDaysAgo = formatDateString(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000));
  const sixDaysAgo = formatDateString(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000));
  
  mockUsers.set('田中太郎', {
    name: '田中太郎',
    studyTime: 7200, // 2 hours
    profileImageUrl: 'https://yt3.ggpht.com/ToBVHdJPmTSckqWsesfbs8OxH6kBd-V-81pP8BLysaXnLwVfOjFF9pA05HGdiuTRJjYwuVZ_yA=s88-c-k-c0x00ffffff-no-rj',
    startTime: undefined,
    isStudying: false,
    hasVisitStamp: true,
    visitStamps: {
      [today]: true,
      [yesterday]: true,
      [threeDaysAgo]: true,
    },
    studySessions: [
      {
        date: today,
        studyTime: 3600,
        sessions: [{
          startTime: new Date(Date.now() - 7200000),
          endTime: new Date(Date.now() - 3600000),
          duration: 3600
        }]
      },
      {
        date: yesterday,
        studyTime: 3600,
        sessions: [{
          startTime: new Date(Date.now() - 24 * 60 * 60 * 1000 - 3600000),
          endTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
          duration: 3600
        }]
      }
    ]
  });
  
  mockUsers.set('佐藤花子', {
    name: '佐藤花子',
    studyTime: 5400, // 1.5 hours
    profileImageUrl: 'https://yt3.ggpht.com/ToBVHdJPmTSckqWsesfbs8OxH6kBd-V-81pP8BLysaXnLwVfOjFF9pA05HGdiuTRJjYwuVZ_yA=s88-c-k-c0x00ffffff-no-rj',
    startTime: new Date(Date.now() - 1800000), // started 30 minutes ago
    isStudying: true,
    hasVisitStamp: true,
    visitStamps: {
      [today]: true,
      [fiveDaysAgo]: true,
    },
    studySessions: [
      {
        date: today,
        studyTime: 3600,
        sessions: [{
          startTime: new Date(Date.now() - 5400000),
          endTime: new Date(Date.now() - 1800000),
          duration: 3600
        }]
      },
      {
        date: yesterday,
        studyTime: 1800,
        sessions: [{
          startTime: new Date(Date.now() - 24 * 60 * 60 * 1000 - 1800000),
          endTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
          duration: 1800
        }]
      }
    ]
  });
  
  mockUsers.set('山田次郎', {
    name: '山田次郎',
    studyTime: 3600, // 1 hour
    profileImageUrl: 'https://yt3.ggpht.com/ToBVHdJPmTSckqWsesfbs8OxH6kBd-V-81pP8BLysaXnLwVfOjFF9pA05HGdiuTRJjYwuVZ_yA=s88-c-k-c0x00ffffff-no-rj',
    startTime: undefined,
    isStudying: false,
    hasVisitStamp: true,
    visitStamps: {
      [yesterday]: true,
      [fourDaysAgo]: true,
      [sixDaysAgo]: true,
    },
    studySessions: [
      {
        date: today,
        studyTime: 3600,
        sessions: [{
          startTime: new Date(Date.now() - 3600000),
          endTime: new Date(Date.now()),
          duration: 3600
        }]
      }
    ]
  });
  
  mockUsers.set('鈴木一郎', {
    name: '鈴木一郎',
    studyTime: 1800, // 30 minutes
    profileImageUrl: 'https://yt3.ggpht.com/ToBVHdJPmTSckqWsesfbs8OxH6kBd-V-81pP8BLysaXnLwVfOjFF9pA05HGdiuTRJjYwuVZ_yA=s88-c-k-c0x00ffffff-no-rj',
    startTime: new Date(Date.now() - 600000), // started 10 minutes ago
    isStudying: true,
    hasVisitStamp: true,
    visitStamps: {
      [twoDaysAgo]: true,
    },
    studySessions: [
      {
        date: today,
        studyTime: 1200,
        sessions: [{
          startTime: new Date(Date.now() - 1800000),
          endTime: new Date(Date.now() - 600000),
          duration: 1200
        }]
      },
      {
        date: yesterday,
        studyTime: 600,
        sessions: [{
          startTime: new Date(Date.now() - 24 * 60 * 60 * 1000 - 600000),
          endTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
          duration: 600
        }]
      }
    ]
  });
  
  mockUsers.set('高橋美咲', {
    name: '高橋美咲',
    studyTime: 2700, // 45 minutes
    profileImageUrl: 'https://yt3.ggpht.com/ToBVHdJPmTSckqWsesfbs8OxH6kBd-V-81pP8BLysaXnLwVfOjFF9pA05HGdiuTRJjYwuVZ_yA=s88-c-k-c0x00ffffff-no-rj',
    startTime: undefined,
    isStudying: false,
    hasVisitStamp: true,
    visitStamps: {
      [today]: true,
      [yesterday]: true,
      [twoDaysAgo]: true,
      [threeDaysAgo]: true,
      [fourDaysAgo]: true,
    },
    studySessions: [
      {
        date: today,
        studyTime: 2700,
        sessions: [{
          startTime: new Date(Date.now() - 2700000),
          endTime: new Date(Date.now()),
          duration: 2700
        }]
      }
    ]
  });
  
  mockUsers.set('伊藤健太', {
    name: '伊藤健太',
    studyTime: 900, // 15 minutes
    profileImageUrl: 'https://yt3.ggpht.com/ToBVHdJPmTSckqWsesfbs8OxH6kBd-V-81pP8BLysaXnLwVfOjFF9pA05HGdiuTRJjYwuVZ_yA=s88-c-k-c0x00ffffff-no-rj',
    startTime: new Date(Date.now() - 300000), // started 5 minutes ago
    isStudying: true,
    hasVisitStamp: true,
    visitStamps: {
      [yesterday]: true,
      [threeDaysAgo]: true,
    },
    studySessions: [
      {
        date: today,
        studyTime: 600,
        sessions: [{
          startTime: new Date(Date.now() - 900000),
          endTime: new Date(Date.now() - 300000),
          duration: 600
        }]
      },
      {
        date: yesterday,
        studyTime: 300,
        sessions: [{
          startTime: new Date(Date.now() - 24 * 60 * 60 * 1000 - 300000),
          endTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
          duration: 300
        }]
      }
    ]
  });
  
  return mockUsers;
};

export const useStudyTime = () => {
  const [users, setUsers] = useState<Map<string, StudyTimeUser>>(createMockUsers());
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const formatUpdateTime = (date: Date): string => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getSortedUsers = (): StudyTimeUser[] => {
    return Array.from(users.values()).sort((a, b) => b.studyTime - a.studyTime);
  };

  const getWeeklyData = (targetDate?: Date): WeeklyStudyData => {
    return calculateWeeklyStudyData(getSortedUsers(), targetDate);
  };

  return {
    users: getSortedUsers(),
    lastUpdateTime,
    formatTime,
    formatUpdateTime,
    getWeeklyData,
  };
};