import axios, { AxiosInstance, AxiosRequestConfig } from "axios"
import { authApi } from "./auth.api"

type QueueItem = {
  resolve: (token?: string | null) => void
  reject: (err: any) => void
}

export class ApiClient {
  private instance: AxiosInstance
  private isRefreshing = false
  private failedQueue: QueueItem[] = []

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: { "Content-Type": "application/json" },
    })

    this.instance.interceptors.request.use(this.handleRequest.bind(this))
    this.instance.interceptors.response.use(
      this.handleResponse.bind(this),
      this.handleError.bind(this)
    )
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach((p) => {
      if (error) p.reject(error)
      else p.resolve(token)
    })
    this.failedQueue = []
  }

  private handleRequest(config: AxiosRequestConfig | any) {
    const token = localStorage.getItem("access_token")

    if (
      token &&
      !config.url?.includes("/auth/login") &&
      !config.url?.includes("/auth/refresh")
    ) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  }

  private handleResponse(response: any) {
    return response.data
  }

  private async handleError(error: any) {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem("refresh_token")
      if (!refreshToken) {
        localStorage.clear()
        window.location.href = "/login"
        return Promise.reject(error)
      }

      if (this.isRefreshing) {
        return new Promise((resolve, reject) => {
          this.failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers = originalRequest.headers || {}
          originalRequest.headers.Authorization = `Bearer ${token}`
          return this.instance(originalRequest)
        })
      }

      this.isRefreshing = true

      try {
        const res = await authApi.refresh(refreshToken)
        const { accessToken } = res.data

        localStorage.setItem("access_token", accessToken)

        this.processQueue(null, accessToken)

        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return this.instance(originalRequest)
      } catch (err) {
        this.processQueue(err, null)
        localStorage.clear()
        window.location.href = "/login"
        return Promise.reject(err)
      } finally {
        this.isRefreshing = false
      }
    }

    return Promise.reject(error)
  }

  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config) as Promise<T>
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config) as Promise<T>
  }

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch(url, data, config) as Promise<T>
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config) as Promise<T>
  }

  getInstance(): AxiosInstance {
    return this.instance
  }
}

const apiClient = new ApiClient()

export default apiClient
