import axios, { AxiosInstance } from 'axios';

export interface JSONRPCRequest {
  jsonrpc: '2.0';
  method: string;
  params?: any;
  id: string | number;
}

export interface JSONRPCResponse {
  jsonrpc: '2.0';
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
  id: string | number;
}

class JSONRPCClient {
  private client: AxiosInstance;
  private token: string | null = null;
  private anonymousSessionId: string | null = null;

  constructor(baseURL: string = '/api') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Load token and session from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
      this.anonymousSessionId = localStorage.getItem('anonymousSessionId');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  setAnonymousSessionId(sessionId: string | null) {
    this.anonymousSessionId = sessionId;
    if (sessionId && typeof window !== 'undefined') {
      localStorage.setItem('anonymousSessionId', sessionId);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('anonymousSessionId');
    }
  }

  async call(method: string, params?: any): Promise<any> {
    const request: JSONRPCRequest = {
      jsonrpc: '2.0',
      method,
      params: params || {},
      id: Date.now() + Math.random()
    };

    const headers: any = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    if (this.anonymousSessionId) {
      headers['x-anonymous-session-id'] = this.anonymousSessionId;
    }

    try {
      const response = await this.client.post<JSONRPCResponse>('/', request, { headers });

      if (response.data.error) {
        throw new Error(response.data.error.message || 'JSON-RPC Error');
      }

      return response.data.result;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error.message || 'Request failed');
      }
      throw error;
    }
  }

  async batch(requests: Array<{ method: string; params?: any }>): Promise<any[]> {
    const jsonRpcRequests: JSONRPCRequest[] = requests.map((req, index) => ({
      jsonrpc: '2.0',
      method: req.method,
      params: req.params || {},
      id: Date.now() + index
    }));

    const headers: any = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    if (this.anonymousSessionId) {
      headers['x-anonymous-session-id'] = this.anonymousSessionId;
    }

    try {
      const response = await this.client.post<JSONRPCResponse[]>('/batch', jsonRpcRequests, { headers });
      return response.data.map(res => res.result);
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error.message || 'Batch request failed');
      }
      throw error;
    }
  }
}

export const jsonrpc = new JSONRPCClient();

