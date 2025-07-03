'use client';

import WeeklyStudyDisplay from '@/components/WeeklyStudyDisplay';
import { useStudyTime } from '@/hooks/useStudyTime';

export default function Home() {
  const { getWeeklyData, formatTime, lastUpdateTime, formatUpdateTime } = useStudyTime();

  return (
    <WeeklyStudyDisplay 
      getWeeklyData={getWeeklyData} 
      formatTime={formatTime}
      lastUpdateTime={lastUpdateTime}
      formatUpdateTime={formatUpdateTime}
    />
  );
}
