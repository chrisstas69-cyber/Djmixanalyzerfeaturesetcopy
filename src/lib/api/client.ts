/**
 * API Client
 * 
 * Centralized API client for making requests to the backend.
 * In production, this would connect to a real Express/Node.js backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      this.token = storedToken;
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<{ user: any; token: string; refreshToken: string }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async signup(email: string, password: string, username: string) {
    const response = await this.request<{ user: any; token: string; refreshToken: string }>(
      "/auth/signup",
      {
        method: "POST",
        body: JSON.stringify({ email, password, username }),
      }
    );
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async logout() {
    await this.request("/auth/logout", { method: "POST" });
    this.setToken(null);
  }

  async refreshToken(refreshToken: string) {
    const response = await this.request<{ token: string; refreshToken: string }>(
      "/auth/refresh",
      {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      }
    );
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  // User endpoints
  async getUser(userId: string) {
    return this.request(`/users/${userId}`);
  }

  async updateUser(userId: string, updates: Partial<any>) {
    return this.request(`/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  async followUser(userId: string) {
    return this.request(`/users/${userId}/follow`, { method: "POST" });
  }

  async unfollowUser(userId: string) {
    return this.request(`/users/${userId}/unfollow`, { method: "POST" });
  }

  // Track endpoints
  async getTracks(params?: { page?: number; limit?: number; search?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.search) query.append("search", params.search);
    return this.request<PaginatedResponse<any>>(`/tracks?${query}`);
  }

  async getTrack(trackId: string) {
    return this.request(`/tracks/${trackId}`);
  }

  async createTrack(track: any) {
    return this.request("/tracks", {
      method: "POST",
      body: JSON.stringify(track),
    });
  }

  async updateTrack(trackId: string, updates: Partial<any>) {
    return this.request(`/tracks/${trackId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  async deleteTrack(trackId: string) {
    return this.request(`/tracks/${trackId}`, { method: "DELETE" });
  }

  // Mix endpoints
  async getMixes(params?: { page?: number; limit?: number; userId?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.userId) query.append("userId", params.userId);
    return this.request<PaginatedResponse<any>>(`/mixes?${query}`);
  }

  async getMix(mixId: string) {
    return this.request(`/mixes/${mixId}`);
  }

  async createMix(mix: any) {
    return this.request("/mixes", {
      method: "POST",
      body: JSON.stringify(mix),
    });
  }

  async updateMix(mixId: string, updates: Partial<any>) {
    return this.request(`/mixes/${mixId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  async deleteMix(mixId: string) {
    return this.request(`/mixes/${mixId}`, { method: "DELETE" });
  }

  // Like/Comment endpoints
  async likeItem(itemType: "mix" | "track", itemId: string) {
    return this.request(`/${itemType}s/${itemId}/like`, { method: "POST" });
  }

  async unlikeItem(itemType: "mix" | "track", itemId: string) {
    return this.request(`/${itemType}s/${itemId}/unlike`, { method: "POST" });
  }

  async addComment(itemType: "mix" | "track", itemId: string, text: string) {
    return this.request(`/${itemType}s/${itemId}/comments`, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  }

  async getComments(itemType: "mix" | "track", itemId: string) {
    return this.request(`/${itemType}s/${itemId}/comments`);
  }

  // Notification endpoints
  async getNotifications(params?: { page?: number; limit?: number; unreadOnly?: boolean }) {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.unreadOnly) query.append("unreadOnly", "true");
    return this.request<PaginatedResponse<any>>(`/notifications?${query}`);
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request(`/notifications/${notificationId}/read`, { method: "POST" });
  }

  // Search endpoints
  async search(query: string, type?: "all" | "tracks" | "mixes" | "users") {
    const params = new URLSearchParams({ q: query });
    if (type) params.append("type", type);
    return this.request(`/search?${params}`);
  }

  // File upload endpoints
  async uploadTrack(file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append("file", file);

    // Use XMLHttpRequest for progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${this.baseURL}/tracks/upload`);

      if (this.token) {
        xhr.setRequestHeader("Authorization", `Bearer ${this.token}`);
      }

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => reject(new Error("Upload failed"));
      xhr.send(formData);
    });
  }

  async getPresignedUrl(fileName: string, fileType: string) {
    return this.request<{ url: string; key: string }>("/files/presigned-url", {
      method: "POST",
      body: JSON.stringify({ fileName, fileType }),
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

