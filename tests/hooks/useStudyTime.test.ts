import { renderHook, act } from '@testing-library/react'
import { useStudyTime } from '../../src/hooks/useStudyTime'
import { YouTubeLiveChatMessage } from '../../src/types/youtube'

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('useStudyTime', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockClear()
  })

  it('initializes with mock data', () => {
    const { result } = renderHook(() => useStudyTime())

    expect(result.current.users).toHaveLength(6) // Mock data has 6 users
    expect(result.current.lastUpdateTime).toBeInstanceOf(Date)
    expect(typeof result.current.formatTime).toBe('function')
    expect(typeof result.current.formatUpdateTime).toBe('function')
  })

  it('formats time correctly', () => {
    const { result } = renderHook(() => useStudyTime())

    expect(result.current.formatTime(0)).toBe('00:00')
    expect(result.current.formatTime(60)).toBe('00:01')
    expect(result.current.formatTime(3600)).toBe('01:00')
    expect(result.current.formatTime(3665)).toBe('01:01')
    expect(result.current.formatTime(7200)).toBe('02:00')
    expect(result.current.formatTime(90)).toBe('00:01') // 90 seconds = 1 minute
    expect(result.current.formatTime(3900)).toBe('01:05') // 3900 seconds = 1 hour 5 minutes
  })

  it('formats update time correctly', () => {
    const { result } = renderHook(() => useStudyTime())
    
    const testDate = new Date('2023-01-01T09:05:00')
    expect(result.current.formatUpdateTime(testDate)).toBe('09:05')
    
    const testDate2 = new Date('2023-01-01T14:30:00')
    expect(result.current.formatUpdateTime(testDate2)).toBe('14:30')
    
    const testDate3 = new Date('2023-01-01T00:00:00')
    expect(result.current.formatUpdateTime(testDate3)).toBe('00:00')
    
    const testDate4 = new Date('2023-01-01T23:59:00')
    expect(result.current.formatUpdateTime(testDate4)).toBe('23:59')
  })

  it('sorts users by study time in descending order', () => {
    const { result } = renderHook(() => useStudyTime())

    const users = result.current.users
    
    // Check if users are sorted by study time (descending)
    for (let i = 0; i < users.length - 1; i++) {
      expect(users[i].studyTime).toBeGreaterThanOrEqual(users[i + 1].studyTime)
    }
  })

  it('includes expected mock users with correct properties', () => {
    const { result } = renderHook(() => useStudyTime())

    const users = result.current.users
    
    // Check for specific mock users
    const tanaka = users.find(u => u.name === '田中太郎')
    expect(tanaka).toBeDefined()
    expect(tanaka?.studyTime).toBe(7200) // 2 hours
    expect(tanaka?.isStudying).toBe(false)
    
    const sato = users.find(u => u.name === '佐藤花子')
    expect(sato).toBeDefined()
    expect(sato?.studyTime).toBe(5400) // 1.5 hours
    expect(sato?.isStudying).toBe(true)
  })

  it('handles edge cases in time formatting', () => {
    const { result } = renderHook(() => useStudyTime())

    // Test edge cases - negative time shows as calculated
    expect(result.current.formatTime(-1)).toBe('-1:-1') // Negative time
    expect(result.current.formatTime(0.5)).toBe('00:00') // Decimal time  
    expect(result.current.formatTime(359999)).toBe('99:59') // Very large time
  })

  it('maintains consistent user ordering', () => {
    const { result } = renderHook(() => useStudyTime())

    const firstCall = result.current.users.map(u => u.name)
    
    // Re-render and check if order is consistent
    const { result: result2 } = renderHook(() => useStudyTime())
    const secondCall = result2.current.users.map(u => u.name)
    
    expect(firstCall).toEqual(secondCall)
  })
})