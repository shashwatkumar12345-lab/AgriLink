// Mock Firebase Configuration for Local Storage
export const app = {};
export const db = {};
export const storage = {};

// Mock Auth
export const auth = {
  currentUser: JSON.parse(localStorage.getItem('mock_user') || 'null'),
  onAuthStateChanged: (callback: (user: any) => void) => {
    callback(auth.currentUser);
    return () => {};
  },
  updateCurrentUser: (user: any) => {
    auth.currentUser = user;
    if (user) {
        localStorage.setItem('mock_user', JSON.stringify(user));
    } else {
        localStorage.removeItem('mock_user');
    }
  }
};
