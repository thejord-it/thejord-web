// Authentication utilities for JWT and cookies
import Cookies from 'js-cookie'

const TOKEN_KEY = 'thejord_admin_token'
// Use proxy for client-side API calls (keeps backend internal)
const API_URL = '/api/proxy'

export interface User {
  id: string
  email: string
  name: string
  role: string
}

export interface LoginResponse {
  success: boolean
  data?: {
    token: string
    user: User
  }
  error?: string
}

/**
 * Login user with email and password
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (response.ok && data.success) {
      // Store token in cookie (7 days expiry)
      Cookies.set(TOKEN_KEY, data.data.token, {
        expires: 7,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      })

      return {
        success: true,
        data: {
          token: data.data.token,
          user: data.data.user,
        },
      }
    }

    return {
      success: false,
      error: data.error || 'Login failed',
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

/**
 * Logout user by removing token
 */
export function logout(): void {
  Cookies.remove(TOKEN_KEY)
  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/admin/login'
  }
}

/**
 * Get stored auth token
 */
export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY)
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken()
}

/**
 * Get authorization header for API requests
 */
export function getAuthHeader(): Record<string, string> {
  const token = getToken()
  if (!token) {
    return {}
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

/**
 * Make authenticated API request
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken()

  if (!token) {
    throw new Error('Not authenticated')
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  }

  return fetch(url, {
    ...options,
    headers,
  })
}
