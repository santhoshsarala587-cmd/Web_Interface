import { createContext, useContext, useEffect, useState } from 'react';
import { getData, setData } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => getData('currentUser', null));

  useEffect(() => {
    if (currentUser) setData('currentUser', currentUser);
  }, [currentUser]);

  function login(email, password, role) {
    const users = getData('users', []);
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.role === role
    );
    if (!user) return { success: false, message: 'Invalid credentials or role mismatch.' };
    setCurrentUser(user);
    setData('currentUser', user);
    return { success: true, user };
  }

  function signup({ name, email, studentId, password, role }) {
    const users = getData('users', []);
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const newUser = {
      id: `u_${Date.now()}`,
      name,
      email,
      password,
      role,
      studentId: role === 'student' ? studentId || `STU${Math.floor(1000 + Math.random() * 9000)}` : null,
    };
    setData('users', [...users, newUser]);

    if (role === 'student') {
      const students = getData('students', []);
      students.push({
        studentId: newUser.studentId,
        name,
        email,
        department: 'CSE',
        year: 'I',
        avatar: null,
        completedQuizzes: 0,
        averageScore: 0,
        status: 'Active',
      });
      setData('students', students);
    }

    setCurrentUser(newUser);
    setData('currentUser', newUser);
    return { success: true, user: newUser };
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem('quiznova_currentUser');
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
