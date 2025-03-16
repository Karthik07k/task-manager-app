import { API_BASE_URL } from "@/app/(auth)/baseURL";
import { LoginCredentials, RegisterCredentials } from "./types";

export const api = {
  async login(credentials: LoginCredentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    let data;
    try {
      data = await response.json(); // Read response body
    } catch (error) {
      throw new Error("Invalid response from server");
    }

    if (!response.ok) {
      const errorMessage = data?.message || "Login failed";
      return Promise.reject({ status: response.status, message: errorMessage });
    }

    return data;
  },

 async register(credentials: RegisterCredentials) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    return response.json();
  }
};