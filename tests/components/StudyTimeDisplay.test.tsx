import { render, screen } from '@testing-library/react'
import { StudyTimeDisplay } from '../../src/components/StudyTimeDisplay'
import { StudyTimeUser } from '../../src/types/youtube'

// Mock data
const mockUsers: StudyTimeUser[] = [
  {
    name: 'Test User 1',
    studyTime: 3600, // 1 hour
    profileImageUrl: 'https://example.com/image1.jpg',
    startTime: undefined,
    isStudying: false,
  },
  {
    name: 'Test User 2',
    studyTime: 1800, // 30 minutes
    profileImageUrl: 'https://example.com/image2.jpg',
    startTime: new Date(),
    isStudying: true,
  },
  {
    name: 'Test User 3',
    studyTime: 0,
    profileImageUrl: 'https://example.com/image3.jpg',
    startTime: undefined,
    isStudying: false,
  },
]

const mockFormatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

const mockFormatUpdateTime = (date: Date): string => {
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const defaultProps = {
  users: mockUsers,
  formatTime: mockFormatTime,
  lastUpdateTime: new Date('2023-01-01T12:00:00'),
  formatUpdateTime: mockFormatUpdateTime,
}

describe('StudyTimeDisplay', () => {
  it('renders the title correctly', () => {
    render(<StudyTimeDisplay {...defaultProps} />)
    
    expect(screen.getByText('Study Time Tracker')).toBeInTheDocument()
  })

  it('displays the last update time', () => {
    render(<StudyTimeDisplay {...defaultProps} />)
    
    expect(screen.getByText(/Updated:/)).toBeInTheDocument()
  })

  it('renders user information correctly', () => {
    render(<StudyTimeDisplay {...defaultProps} />)
    
    // Check if user names are displayed (only first 3 due to pagination)
    expect(screen.getByText('Test User 1')).toBeInTheDocument()
    expect(screen.getByText('Test User 2')).toBeInTheDocument()
    expect(screen.getByText('Test User 3')).toBeInTheDocument()
  })

  it('formats study time correctly', () => {
    render(<StudyTimeDisplay {...defaultProps} />)
    
    // Check formatted study times
    expect(screen.getByText('01:00')).toBeInTheDocument() // 1 hour
    expect(screen.getByText('00:30')).toBeInTheDocument() // 30 minutes
    expect(screen.getByText('00:00')).toBeInTheDocument() // 0 minutes
  })

  it('displays "Studying" status for active users', () => {
    render(<StudyTimeDisplay {...defaultProps} />)
    
    expect(screen.getByText('Studying')).toBeInTheDocument()
  })

  it('displays "Finished" status for users who completed study', () => {
    render(<StudyTimeDisplay {...defaultProps} />)
    
    expect(screen.getByText('Finished')).toBeInTheDocument()
  })

  it('shows waiting message when no users', () => {
    const propsWithNoUsers = {
      ...defaultProps,
      users: [],
    }
    
    render(<StudyTimeDisplay {...propsWithNoUsers} />)
    
    expect(screen.getByText('Waiting for comments...')).toBeInTheDocument()
  })

  it('displays user profile images', () => {
    render(<StudyTimeDisplay {...defaultProps} />)
    
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(3) // 3 users displayed
    
    // Check alt attributes
    expect(screen.getByAltText('Test User 1')).toBeInTheDocument()
    expect(screen.getByAltText('Test User 2')).toBeInTheDocument()
    expect(screen.getByAltText('Test User 3')).toBeInTheDocument()
  })

  it('applies correct CSS classes for styling', () => {
    render(<StudyTimeDisplay {...defaultProps} />)
    
    // Check if studying status has correct styling
    const studyingElement = screen.getByText('Studying')
    expect(studyingElement).toHaveClass('text-green-400', 'animate-pulse')
    
    // Check if finished status has correct styling
    const finishedElement = screen.getByText('Finished')
    expect(finishedElement).toHaveClass('text-blue-400')
  })

  it('handles transition state correctly', () => {
    render(<StudyTimeDisplay {...defaultProps} />)
    
    // Check if transition classes are applied to the correct element
    const userListContainer = screen.getByText('Test User 1').closest('div')?.parentElement?.parentElement
    expect(userListContainer).toHaveClass('transition-opacity', 'duration-1000')
  })

  it('respects usersPerPage limit', () => {
    const manyUsers: StudyTimeUser[] = Array.from({ length: 10 }, (_, i) => ({
      name: `User ${i + 1}`,
      studyTime: i * 600,
      profileImageUrl: `https://example.com/image${i + 1}.jpg`,
      startTime: undefined,
      isStudying: false,
    }))

    const propsWithManyUsers = {
      ...defaultProps,
      users: manyUsers,
    }
    
    render(<StudyTimeDisplay {...propsWithManyUsers} />)
    
    // Should only display 3 users (usersPerPage = 3)
    expect(screen.getByText('User 1')).toBeInTheDocument()
    expect(screen.getByText('User 2')).toBeInTheDocument()
    expect(screen.getByText('User 3')).toBeInTheDocument()
    expect(screen.queryByText('User 4')).not.toBeInTheDocument()
  })
})