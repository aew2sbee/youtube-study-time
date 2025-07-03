import { StudyTimeUser } from '@/types/youtube';

export const getWeekVisitStamps = (users: StudyTimeUser[], weekStart: string): boolean[] => {
  // Generate 7 dates for the week starting from weekStart (Monday)
  const startDate = new Date(weekStart);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  });

  // Check if any user has a visit stamp for each day
  return weekDates.map(date => 
    users.some(user => user.visitStamps[date] === true)
  );
};