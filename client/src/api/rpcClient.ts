import axios, { AxiosInstance } from 'axios';

class RPCClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string = 'http://localhost:5000/api') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          // Create headers object if it doesn't exist
          if (!config.headers) {
            config.headers = config.headers as any || {};
          }
          // Add authorization header
          (config.headers as any).Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  async call(method: string, params: any = {}) {
    try {
      const response = await this.client.post('/jsonrpc', {
        jsonrpc: '2.0',
        method,
        params,
        id: Date.now(),
      });

      if (response.data.error) {
        throw new Error(response.data.error.message);
      }

      return response.data.result;
    } catch (error) {
      console.error('RPC Call failed:', error);
      throw error;
    }
  }

  async callBatch(requests: Array<{ method: string; params: any }>) {
    try {
      const rpcRequests = requests.map((req, index) => ({
        jsonrpc: '2.0',
        method: req.method,
        params: req.params,
        id: index + 1,
      }));

      const response = await this.client.post('/jsonrpc', rpcRequests);
      return response.data;
    } catch (error) {
      console.error('RPC Batch call failed:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const jsonrpc = new RPCClient(import.meta.env.VITE_API_URL);

export default jsonrpc;
