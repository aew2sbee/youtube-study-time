// Mock Next.js modules
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200,
    })),
  },
}))

import { GET } from '../../src/app/api/youtube/route'

// Mock googleapis
const mockYoutube = {
  liveChatMessages: {
    list: jest.fn(),
  },
  videos: {
    list: jest.fn(),
  },
}

jest.mock('googleapis', () => ({
  google: {
    youtube: jest.fn(() => mockYoutube),
  },
}))

describe('/api/youtube', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.YOUTUBE_API_KEY = 'test-api-key'
    process.env.VIDEO_ID = 'test-video-id'
  })

  afterEach(() => {
    delete process.env.YOUTUBE_API_KEY
    delete process.env.VIDEO_ID
  })

  it('returns live chat messages successfully', async () => {
    // Mock successful API responses
    mockYoutube.videos.list.mockResolvedValue({
      data: {
        items: [
          {
            liveStreamingDetails: {
              activeLiveChatId: 'test-chat-id',
            },
          },
        ],
      },
    })

    mockYoutube.liveChatMessages.list.mockResolvedValue({
      data: {
        items: [
          {
            id: 'msg1',
            authorDetails: {
              displayName: 'Test User',
              profileImageUrl: 'https://example.com/image.jpg',
            },
            snippet: {
              displayMessage: 'start',
              publishedAt: '2023-01-01T10:00:00Z',
            },
          },
        ],
        nextPageToken: 'next-token',
        pollingIntervalMillis: 5000,
      },
    })

    const request = {
      url: 'http://localhost:3000/api/youtube',
    } as any
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.messages).toHaveLength(1)
    expect(data.messages[0]).toEqual({
      id: 'msg1',
      authorDisplayName: 'Test User',
      displayMessage: 'start',
      publishedAt: '2023-01-01T10:00:00Z',
      profileImageUrl: 'https://example.com/image.jpg',
    })
    expect(data.nextPageToken).toBe('next-token')
    expect(data.pollingIntervalMillis).toBe(5000)
  })

  it('handles missing live chat ID', async () => {
    // Mock no live chat available
    mockYoutube.videos.list.mockResolvedValue({
      data: {
        items: [
          {
            liveStreamingDetails: {},
          },
        ],
      },
    })

    const request = {
      url: 'http://localhost:3000/api/youtube',
    } as any
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('No live chat found')
  })

  it('handles API errors gracefully', async () => {
    // Mock API error - this will cause getLiveChatId to fail and return 404
    mockYoutube.videos.list.mockRejectedValue(new Error('API Error'))

    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const request = {
      url: 'http://localhost:3000/api/youtube',
    } as any
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('No live chat found')

    // Restore console.error
    consoleSpy.mockRestore()
  })

  it('handles pageToken parameter', async () => {
    mockYoutube.videos.list.mockResolvedValue({
      data: {
        items: [
          {
            liveStreamingDetails: {
              activeLiveChatId: 'test-chat-id',
            },
          },
        ],
      },
    })

    mockYoutube.liveChatMessages.list.mockResolvedValue({
      data: {
        items: [],
        pollingIntervalMillis: 5000,
      },
    })

    const request = {
      url: 'http://localhost:3000/api/youtube?pageToken=test-token',
    } as any
    await GET(request)

    expect(mockYoutube.liveChatMessages.list).toHaveBeenCalledWith({
      liveChatId: 'test-chat-id',
      part: ['snippet', 'authorDetails'],
      pageToken: 'test-token',
    })
  })

  it('handles null values in API response', async () => {
    mockYoutube.videos.list.mockResolvedValue({
      data: {
        items: [
          {
            liveStreamingDetails: {
              activeLiveChatId: 'test-chat-id',
            },
          },
        ],
      },
    })

    mockYoutube.liveChatMessages.list.mockResolvedValue({
      data: {
        items: [
          {
            id: null,
            authorDetails: {
              displayName: null,
              profileImageUrl: null,
            },
            snippet: {
              displayMessage: null,
              publishedAt: null,
            },
          },
        ],
        nextPageToken: null,
        pollingIntervalMillis: null,
      },
    })

    const request = {
      url: 'http://localhost:3000/api/youtube',
    } as any
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.messages[0]).toEqual({
      id: '',
      authorDisplayName: '',
      displayMessage: '',
      publishedAt: '',
      profileImageUrl: '',
    })
    expect(data.nextPageToken).toBeUndefined()
    expect(data.pollingIntervalMillis).toBe(5000) // Default fallback
  })

  it('handles multiple messages correctly', async () => {
    mockYoutube.videos.list.mockResolvedValue({
      data: {
        items: [
          {
            liveStreamingDetails: {
              activeLiveChatId: 'test-chat-id',
            },
          },
        ],
      },
    })

    mockYoutube.liveChatMessages.list.mockResolvedValue({
      data: {
        items: [
          {
            id: 'msg1',
            authorDetails: {
              displayName: 'User 1',
              profileImageUrl: 'https://example.com/image1.jpg',
            },
            snippet: {
              displayMessage: 'start',
              publishedAt: '2023-01-01T10:00:00Z',
            },
          },
          {
            id: 'msg2',
            authorDetails: {
              displayName: 'User 2',
              profileImageUrl: 'https://example.com/image2.jpg',
            },
            snippet: {
              displayMessage: 'end',
              publishedAt: '2023-01-01T11:00:00Z',
            },
          },
        ],
        pollingIntervalMillis: 3000,
      },
    })

    const request = {
      url: 'http://localhost:3000/api/youtube',
    } as any
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.messages).toHaveLength(2)
    expect(data.messages[0].authorDisplayName).toBe('User 1')
    expect(data.messages[1].authorDisplayName).toBe('User 2')
    expect(data.pollingIntervalMillis).toBe(3000)
  })

  it('handles empty video list', async () => {
    mockYoutube.videos.list.mockResolvedValue({
      data: {
        items: [],
      },
    })

    const request = {
      url: 'http://localhost:3000/api/youtube',
    } as any
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('No live chat found')
  })
})