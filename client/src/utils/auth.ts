// Use this to decode a token and get the user's information out of it
import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "../types";

// Create a new class to instantiate for a user
class AuthService {
  // Get user data
  getProfile(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<DecodedToken>(token);
    } catch (err) {
      console.error("Error decoding token:", err);
      return null;
    }
  }

  // Check if user's logged in
  loggedIn(): boolean {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    // Use double negation to convert token to boolean and check expiration
    return !!token && !this.isTokenExpired(token);
  }

  // Check if token is expired
  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      // Checks if token is expired
      if (decoded.exp < Date.now() / 1000) {
        return true;
      }
      return false;
    } catch (err) {
      // If there's an error decoding, consider the token expired
      return true;
    }
  }

  getToken(): string | null {
    // Retrieves the user token from localStorage
    return localStorage.getItem("id_token");
  }

  login(idToken: string): void {
    // Saves user token to localStorage
    localStorage.setItem("id_token", idToken);
    window.location.assign("/");
  }

  logout(): void {
    // Clear user token and profile data from localStorage
    localStorage.removeItem("id_token");
    // this will reload the page and reset the state of the application
    window.location.assign("/");
  }
}

export default new AuthService();
