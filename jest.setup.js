import '@testing-library/jest-dom'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock fetch
global.fetch = jest.fn()

// Mock Request and Response for Next.js API routes
global.Request = class MockRequest {
  constructor(input, init) {
    this.url = input
    this.init = init
  }
}

global.Response = class MockResponse {
  constructor(body, init) {
    this.body = body
    this.init = init
    this.status = init?.status || 200
  }
  
  json() {
    return Promise.resolve(JSON.parse(this.body))
  }
}

// Mock environment variables
process.env.YOUTUBE_API_KEY = 'test-api-key'
process.env.VIDEO_ID = 'test-video-id'