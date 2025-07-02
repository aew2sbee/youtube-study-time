import { YouTubeLiveChatMessage, StudyTimeUser, LiveChatResponse } from '../../src/types/youtube'

describe('YouTube Types', () => {
  describe('YouTubeLiveChatMessage', () => {
    it('should have correct structure for start message', () => {
      const message: YouTubeLiveChatMessage = {
        id: 'test-id-1',
        authorDisplayName: 'Test User',
        displayMessage: 'start',
        publishedAt: '2023-01-01T10:00:00Z',
        profileImageUrl: 'https://example.com/image.jpg',
      }

      expect(message).toEqual({
        id: 'test-id-1',
        authorDisplayName: 'Test User',
        displayMessage: 'start',
        publishedAt: '2023-01-01T10:00:00Z',
        profileImageUrl: 'https://example.com/image.jpg',
      })
      
      // Type checking
      expect(typeof message.id).toBe('string')
      expect(typeof message.authorDisplayName).toBe('string')
      expect(typeof message.displayMessage).toBe('string')
      expect(typeof message.publishedAt).toBe('string')
      expect(typeof message.profileImageUrl).toBe('string')
    })

    it('should have correct structure for end message', () => {
      const message: YouTubeLiveChatMessage = {
        id: 'test-id-2',
        authorDisplayName: 'Another User',
        displayMessage: 'end',
        publishedAt: '2023-01-01T11:00:00Z',
        profileImageUrl: 'https://example.com/another-image.jpg',
      }

      expect(message.displayMessage).toBe('end')
      expect(message.authorDisplayName).toBe('Another User')
    })

    it('should handle special characters in display name', () => {
      const message: YouTubeLiveChatMessage = {
        id: 'test-id-3',
        authorDisplayName: '田中太郎@勉強中',
        displayMessage: 'Hello 🌟',
        publishedAt: '2023-01-01T12:00:00Z',
        profileImageUrl: 'https://example.com/japanese-user.jpg',
      }

      expect(message.authorDisplayName).toBe('田中太郎@勉強中')
      expect(message.displayMessage).toBe('Hello 🌟')
    })
  })

  describe('StudyTimeUser', () => {
    it('should have correct structure for studying user', () => {
      const user: StudyTimeUser = {
        name: 'Active Student',
        studyTime: 3600,
        profileImageUrl: 'https://example.com/active-user.jpg',
        startTime: new Date('2023-01-01T10:00:00Z'),
        isStudying: true,
      }

      expect(user.name).toBe('Active Student')
      expect(user.studyTime).toBe(3600)
      expect(user.isStudying).toBe(true)
      expect(user.startTime).toBeInstanceOf(Date)
      expect(typeof user.profileImageUrl).toBe('string')
    })

    it('should have correct structure for finished user', () => {
      const user: StudyTimeUser = {
        name: 'Finished Student',
        studyTime: 1800,
        profileImageUrl: 'https://example.com/finished-user.jpg',
        startTime: undefined,
        isStudying: false,
      }

      expect(user.name).toBe('Finished Student')
      expect(user.studyTime).toBe(1800)
      expect(user.isStudying).toBe(false)
      expect(user.startTime).toBeUndefined()
    })

    it('should handle zero study time', () => {
      const user: StudyTimeUser = {
        name: 'New User',
        studyTime: 0,
        profileImageUrl: 'https://example.com/new-user.jpg',
        startTime: undefined,
        isStudying: false,
      }

      expect(user.studyTime).toBe(0)
      expect(user.isStudying).toBe(false)
    })

    it('should handle Japanese user names', () => {
      const user: StudyTimeUser = {
        name: '佐藤花子',
        studyTime: 5400,
        profileImageUrl: 'https://example.com/sato.jpg',
        startTime: new Date(),
        isStudying: true,
      }

      expect(user.name).toBe('佐藤花子')
      expect(typeof user.name).toBe('string')
    })

    it('should handle very long study times', () => {
      const user: StudyTimeUser = {
        name: 'Marathon Student',
        studyTime: 86400, // 24 hours
        profileImageUrl: 'https://example.com/marathon.jpg',
        startTime: undefined,
        isStudying: false,
      }

      expect(user.studyTime).toBe(86400)
      expect(user.studyTime).toBeGreaterThan(0)
    })
  })

  describe('LiveChatResponse', () => {
    it('should have correct structure with all fields', () => {
      const response: LiveChatResponse = {
        messages: [
          {
            id: 'msg1',
            authorDisplayName: 'User 1',
            displayMessage: 'start',
            publishedAt: '2023-01-01T10:00:00Z',
            profileImageUrl: 'https://example.com/image1.jpg',
          },
          {
            id: 'msg2',
            authorDisplayName: 'User 2',
            displayMessage: 'end',
            publishedAt: '2023-01-01T11:00:00Z',
            profileImageUrl: 'https://example.com/image2.jpg',
          },
        ],
        nextPageToken: 'next-token-123',
        pollingIntervalMillis: 5000,
      }

      expect(response.messages).toHaveLength(2)
      expect(response.nextPageToken).toBe('next-token-123')
      expect(response.pollingIntervalMillis).toBe(5000)
      expect(Array.isArray(response.messages)).toBe(true)
      expect(typeof response.pollingIntervalMillis).toBe('number')
    })

    it('should have correct structure without optional fields', () => {
      const response: LiveChatResponse = {
        messages: [],
        pollingIntervalMillis: 3000,
      }

      expect(response.messages).toHaveLength(0)
      expect(response.nextPageToken).toBeUndefined()
      expect(response.pollingIntervalMillis).toBe(3000)
      expect(Array.isArray(response.messages)).toBe(true)
    })

    it('should handle single message response', () => {
      const response: LiveChatResponse = {
        messages: [
          {
            id: 'single-msg',
            authorDisplayName: 'Solo User',
            displayMessage: 'Hello World',
            publishedAt: '2023-01-01T12:00:00Z',
            profileImageUrl: 'https://example.com/solo.jpg',
          },
        ],
        nextPageToken: 'token-456',
        pollingIntervalMillis: 2000,
      }

      expect(response.messages).toHaveLength(1)
      expect(response.messages[0].displayMessage).toBe('Hello World')
      expect(response.pollingIntervalMillis).toBe(2000)
    })

    it('should handle different polling intervals', () => {
      const fastResponse: LiveChatResponse = {
        messages: [],
        pollingIntervalMillis: 1000,
      }

      const slowResponse: LiveChatResponse = {
        messages: [],
        pollingIntervalMillis: 30000,
      }

      expect(fastResponse.pollingIntervalMillis).toBe(1000)
      expect(slowResponse.pollingIntervalMillis).toBe(30000)
      expect(fastResponse.pollingIntervalMillis).toBeLessThan(slowResponse.pollingIntervalMillis)
    })
  })

  describe('Type Compatibility', () => {
    it('should allow LiveChatResponse to contain YouTubeLiveChatMessage arrays', () => {
      const messages: YouTubeLiveChatMessage[] = [
        {
          id: 'test-1',
          authorDisplayName: 'Test User 1',
          displayMessage: 'start',
          publishedAt: '2023-01-01T10:00:00Z',
          profileImageUrl: 'https://example.com/test1.jpg',
        },
      ]

      const response: LiveChatResponse = {
        messages,
        pollingIntervalMillis: 5000,
      }

      expect(response.messages).toBe(messages)
      expect(response.messages[0]).toEqual(messages[0])
    })

    it('should maintain type safety for StudyTimeUser properties', () => {
      const user: StudyTimeUser = {
        name: 'Type Test User',
        studyTime: 1800,
        profileImageUrl: 'https://example.com/typetest.jpg',
        startTime: new Date(),
        isStudying: true,
      }

      // These should all be type-safe operations
      const isActive: boolean = user.isStudying
      const timeInSeconds: number = user.studyTime
      const userName: string = user.name
      const startDate: Date | undefined = user.startTime

      expect(typeof isActive).toBe('boolean')
      expect(typeof timeInSeconds).toBe('number')
      expect(typeof userName).toBe('string')
      expect(startDate instanceof Date || startDate === undefined).toBe(true)
    })
  })
})