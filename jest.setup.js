import '@testing-library/jest-dom'

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  db: {},
  auth: {},
}))

// Mock Firebase services
jest.mock('@/services/authService', () => ({
  AuthService: {
    signInWithEmail: jest.fn(),
    signUpWithEmail: jest.fn(),
    signInWithGoogle: jest.fn(),
    signInAnonymously: jest.fn(),
    signOut: jest.fn(),
    getCurrentUser: jest.fn(),
    onAuthStateChange: jest.fn(() => jest.fn()), // Returns unsubscribe function
  },
}))

jest.mock('@/services/firestoreService', () => ({
  FirestoreService: {
    createNote: jest.fn(),
    getNote: jest.fn(),
    getNotes: jest.fn(),
    updateNote: jest.fn(),
    deleteNote: jest.fn(),
    searchNotes: jest.fn(),
    createTag: jest.fn(),
    getTags: jest.fn(),
    createCategory: jest.fn(),
    getCategories: jest.fn(),
  },
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock file reader
global.FileReader = class FileReader {
  constructor() {
    this.readAsDataURL = jest.fn()
    this.result = 'data:image/jpeg;base64,test'
  }
}

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-url')
global.URL.revokeObjectURL = jest.fn()

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
} 