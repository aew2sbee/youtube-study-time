// Test function to manually trigger progress display
// Add some visit stamps to mock users for testing

export const addTestVisitStamps = () => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  console.log('Test visit stamps for:', { today, yesterday, twoDaysAgo });
  
  return {
    [today]: true,
    [yesterday]: true,
    [twoDaysAgo]: true,
  };
};