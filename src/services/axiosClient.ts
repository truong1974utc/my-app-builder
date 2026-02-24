import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { authApi } from "./auth.api";

type QueueItem = {
  resolve: (token?: string | null) => void;
  reject: (err: any) => void;
};

export class ApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: QueueItem[] = [];

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: { "Content-Type": "application/json" },
    });

    this.instance.interceptors.request.use(this.handleRequest.bind(this));

    this.instance.interceptors.response.use(
      this.handleResponse.bind(this),
      this.handleError.bind(this),
    );
  }

  // =============================
  // REQUEST
  // =============================
  private handleRequest(config: AxiosRequestConfig | any) {
    const token = localStorage.getItem("accessToken");

    console.log("🔵 REQUEST:", config.url);
    console.log("🔵 accessToken:", token);

    if (
      token &&
      !config.url?.includes("/auth/login") &&
      !config.url?.includes("/auth/refresh")
    ) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }

  // =============================
  // RESPONSE SUCCESS
  // =============================
  private handleResponse(response: any) {
    console.log("🟢 RESPONSE OK:", response.config?.url);
    return response.data;
  }

  // =============================
  // PROCESS QUEUE
  // =============================
  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach((p) => {
      if (error) p.reject(error);
      else p.resolve(token);
    });
    this.failedQueue = [];
  }

  // =============================
  // RESPONSE ERROR
  // =============================
  private async handleError(error: any) {
    const originalRequest = error.config;

    console.log("🔴 RESPONSE ERROR:", originalRequest?.url);

    if (!error.response) {
      return Promise.reject(error);
    }

    // 🚫 Không refresh nếu đang là refresh
    if (originalRequest?.url?.includes("/auth/refresh")) {
      console.log("❌ Refresh itself failed");
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // 🔁 Nếu 401 và chưa retry
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      console.log("🟡 Try refresh with token:", refreshToken);

      if (!refreshToken) {
        console.log("❌ No refreshToken → logout");
        localStorage.clear();
        return Promise.reject(error);
      }

      // Nếu đang refresh thì chờ
      if (this.isRefreshing) {
        console.log("⏳ Waiting for refresh...");

        return new Promise((resolve, reject) => {
          this.failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return this.instance(originalRequest);
        });
      }

      this.isRefreshing = true;

      try {
        console.log("🟡 Calling refresh API...");
        const res = await authApi.refresh(refreshToken);

        // ⚠ QUAN TRỌNG: tuỳ backend trả gì
        const newAccessToken = res.data?.accessToken || res.accessToken;

        console.log("🟢 New accessToken:", newAccessToken);

        if (!newAccessToken) {
          throw new Error("No accessToken returned");
        }

        localStorage.setItem("accessToken", newAccessToken);

        this.processQueue(null, newAccessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return this.instance(originalRequest);
      } catch (err) {
        console.log("❌ Refresh failed → logout");
        this.processQueue(err, null);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        this.isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }

  // =============================
  // METHODS
  // =============================

  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config) as Promise<T>;
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.instance.post(url, data, config) as Promise<T>;
  }

  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.instance.patch(url, data, config) as Promise<T>;
  }

  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.instance.put(url, data, config) as Promise<T>;
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config) as Promise<T>;
  }

  getInstance(): AxiosInstance {
    return this.instance;
  }
}

const apiClient = new ApiClient();
export default apiClient;
