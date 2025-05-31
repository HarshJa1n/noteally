import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  updateProfile
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

// Google Auth Provider
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  isAnonymous: boolean
}

export class AuthService {
  // Convert Firebase User to AuthUser
  private static mapUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      isAnonymous: user.isAnonymous
    }
  }

  // Email/Password Sign Up
  static async signUpWithEmail(email: string, password: string, displayName?: string): Promise<AuthUser> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update profile with display name if provided
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName })
      }
      
      return this.mapUser(userCredential.user)
    } catch (error: any) {
      throw new Error(`Sign up failed: ${error.message}`)
    }
  }

  // Email/Password Sign In
  static async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password)
      return this.mapUser(userCredential.user)
    } catch (error: any) {
      throw new Error(`Sign in failed: ${error.message}`)
    }
  }

  // Google Sign In
  static async signInWithGoogle(): Promise<AuthUser> {
    try {
      const userCredential: UserCredential = await signInWithPopup(auth, googleProvider)
      return this.mapUser(userCredential.user)
    } catch (error: any) {
      throw new Error(`Google sign in failed: ${error.message}`)
    }
  }

  // Anonymous Sign In
  static async signInAnonymously(): Promise<AuthUser> {
    try {
      const userCredential: UserCredential = await signInAnonymously(auth)
      return this.mapUser(userCredential.user)
    } catch (error: any) {
      throw new Error(`Anonymous sign in failed: ${error.message}`)
    }
  }

  // Sign Out
  static async signOut(): Promise<void> {
    try {
      await signOut(auth)
    } catch (error: any) {
      throw new Error(`Sign out failed: ${error.message}`)
    }
  }

  // Get Current User
  static getCurrentUser(): AuthUser | null {
    const user = auth.currentUser
    return user ? this.mapUser(user) : null
  }

  // Auth State Observer
  static onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, (user) => {
      callback(user ? this.mapUser(user) : null)
    })
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!auth.currentUser
  }

  // Get user token
  static async getUserToken(): Promise<string | null> {
    const user = auth.currentUser
    if (!user) return null
    
    try {
      return await user.getIdToken()
    } catch (error) {
      console.error('Error getting user token:', error)
      return null
    }
  }
} 