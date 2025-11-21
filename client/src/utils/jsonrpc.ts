// client/src/utils/jsonrpc.ts
import axios, { AxiosInstance } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class JSONRPCClient {
  private client: AxiosInstance;
  private token: string | null = null;
  private anonymousSessionId: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
    });

    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
      this.anonymousSessionId = localStorage.getItem("anonymousSessionId");
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) localStorage.setItem("token", token);
      else localStorage.removeItem("token");
    }
  }

  setAnonymousSessionId(id: string | null) {
    this.anonymousSessionId = id;
    if (typeof window !== "undefined") {
      if (id) localStorage.setItem("anonymousSessionId", id);
      else localStorage.removeItem("anonymousSessionId");
    }
  }

  private buildHeaders() {
    const headers: Record<string, string> = {};
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    if (this.anonymousSessionId) headers["x-anonymous-session-id"] = this.anonymousSessionId;
    return headers;
  }

  async call(method: string, params: any = {}) {
    const request = {
      jsonrpc: "2.0",
      method,
      params,
      id: Date.now()
    };

    try {
      const response = await this.client.post("/", request, {
        headers: this.buildHeaders()
      });

      if (response.data?.error) {
        throw new Error(response.data.error.message || "JSON-RPC Error");
      }

      return response.data.result;
    } catch (error: any) {
      // bubble underlying axios error messages for debugging
      throw error;
    }
  }
}

export const jsonrpc = new JSONRPCClient();
