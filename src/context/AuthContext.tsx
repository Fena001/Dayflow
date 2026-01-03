import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string) => Promise<void>;
  registerAdmin: (data: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  changePassword: (password: string) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Search in the dynamic mockUsers array (which gets updated by DataContext)
        // Check if identifier matches Email OR ID
        const foundUser = mockUsers.find(u =>
          (u.email.toLowerCase() === identifier.toLowerCase() ||
           u.id.toLowerCase() === identifier.toLowerCase())
        );
       
        if (foundUser) {
          // Verify Password
          if (foundUser.password === password) {
            setUser(foundUser);
            localStorage.setItem('user', JSON.stringify(foundUser));
            resolve();
          } else {
            reject(new Error('Invalid password'));
          }
        } else {
          reject(new Error('User not found'));
        }
      }, 800);
    });
  };

  const registerAdmin = async (data: Partial<User> & { password: string }) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const exists = mockUsers.find(u => u.email === data.email);
        if (exists) {
          reject(new Error('User already exists'));
          return;
        }

        const newUser: User = {
          id: `ADM${Math.floor(Math.random() * 1000)}`,
          name: data.name || 'New Admin',
          email: data.email!,
          role: 'admin',
          position: 'Administrator',
          department: 'Management',
          joinDate: new Date().toISOString().split('T')[0],
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'Admin')}&background=random`,
          isTempPassword: false,
          ...data,
          password: data.password,
        };

        mockUsers.push(newUser);
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        resolve();
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const changePassword = async (password: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (user) {
          const updatedUser = { ...user, isTempPassword: false, password: password };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
         
          // Update the "Database" so they can login with new pass next time
          const index = mockUsers.findIndex(u => u.id === user.id);
          if (index !== -1) {
            mockUsers[index] = { ...mockUsers[index], isTempPassword: false, password: password };
          }
          resolve();
        }
      }, 500);
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      registerAdmin,
      logout,
      changePassword,
      isAuthenticated: !!user,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
