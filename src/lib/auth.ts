
// This is a mock authentication file to simulate user login/logout.
// In a real application, this would be replaced with Firebase Authentication.

const FAKE_USER_SESSION_KEY = 'fake_user_session';

// Simulates a user object you might get from Firebase.
interface MockUser {
  uid: string;
  email: string;
}

// --- Public API ---

/**
 * Simulates a user logging in.
 * Stores a mock user session in sessionStorage.
 */
export const login = (email: string, password: string): Promise<MockUser> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // In a real app, you'd validate credentials. Here, we just succeed.
      if (email && password) {
        const user: MockUser = { uid: 'simulated-user-id', email };
        sessionStorage.setItem(FAKE_USER_SESSION_KEY, JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error('Invalid email or password.'));
      }
    }, 500); // Simulate network delay
  });
};

/**
 * Simulates a user signing up.
 * Stores a mock user session in sessionStorage.
 */
export const signup = (email: string, password: string): Promise<MockUser> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // In a real app, you'd create a new user. Here, we just succeed.
      if (email && password) {
        const user: MockUser = { uid: 'simulated-user-id', email };
        sessionStorage.setItem(FAKE_USER_SESSION_KEY, JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error('Please provide email and password to sign up.'));
      }
    }, 500);
  });
};

/**
 * Simulates logging out by clearing the session.
 */
export const logout = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      sessionStorage.removeItem(FAKE_USER_SESSION_KEY);
      resolve();
    }, 200);
  });
};

/**
 * Simulates checking for the currently authenticated user.
 * Reads the session from sessionStorage.
 */
export const getCurrentUser = (): Promise<MockUser | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sessionData = sessionStorage.getItem(FAKE_USER_SESSION_KEY);
      if (sessionData) {
        try {
          resolve(JSON.parse(sessionData));
        } catch (e) {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    }, 200); // Simulate initial auth state check delay
  });
};
