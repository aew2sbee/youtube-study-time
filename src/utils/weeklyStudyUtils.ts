import { StudyTimeUser, WeeklyStudyData } from '../types/youtube';

export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

export function getWeekEnd(date: Date): Date {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return weekEnd;
}

export function formatDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function calculateWeeklyStudyData(users: StudyTimeUser[], targetDate: Date = new Date()): WeeklyStudyData {
  const weekStart = getWeekStart(targetDate);
  const weekEnd = getWeekEnd(targetDate);
  
  const weeklyUsers = users.map(user => {
    const dailyStudyTime: Array<{ date: string; studyTime: number }> = [];
    let totalStudyTime = 0;
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + i);
      const dateString = formatDateString(currentDate);
      
      const daySession = user.studySessions?.find(session => session.date === dateString);
      const dayStudyTime = daySession ? daySession.studyTime : 0;
      
      dailyStudyTime.push({
        date: dateString,
        studyTime: dayStudyTime
      });
      
      totalStudyTime += dayStudyTime;
    }
    
    return {
      name: user.name,
      profileImageUrl: user.profileImageUrl,
      totalStudyTime,
      dailyStudyTime
    };
  });
  
  return {
    weekStart: formatDateString(weekStart),
    weekEnd: formatDateString(weekEnd),
    users: weeklyUsers.sort((a, b) => b.totalStudyTime - a.totalStudyTime)
  };
}

export function getPreviousWeek(date: Date): Date {
  const prevWeek = new Date(date);
  prevWeek.setDate(date.getDate() - 7);
  return prevWeek;
}

export function getNextWeek(date: Date): Date {
  const nextWeek = new Date(date);
  nextWeek.setDate(date.getDate() + 7);
  return nextWeek;
}

export function formatStudyTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function getWeekDateRange(weekStart: string): string {
  const start = new Date(weekStart);
  const end = getWeekEnd(start);
  
  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };
  
  return `${formatDate(start)} - ${formatDate(end)}`;
}