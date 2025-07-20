const API_BASE_URL = 'http://localhost:5001/api';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication
  async signUp(email: string, password: string, name: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Posts
  async createPost(title: string, description: string): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>('/posts', {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    });
  }

  async getTimeline(): Promise<ApiResponse<Post[]>> {
    return this.request<ApiResponse<Post[]>>('/posts/timeline');
  }

  // Users
  async followUser(userId: string): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>(`/users/follow/${userId}`, {
      method: 'POST',
    });
  }

  async unfollowUser(userId: string): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>(`/users/unfollow/${userId}`, {
      method: 'POST',
    });
  }

  async getFollowing(): Promise<ApiResponse<User[]>> {
    return this.request<ApiResponse<User[]>>('/users/following');
  }
}

export const apiService = new ApiService(); 