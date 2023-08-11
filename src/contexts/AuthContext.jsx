import { useContext, useEffect, useState, createContext } from 'react'
import { auth } from '../firebase'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);



  async function signup(email, password, userName) {
    console.log('email', email);
    console.log('password', password);
    console.log('userName', userName);

    return auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        return userCredential.user.updateProfile({ displayName: userName });
      });
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(false);
      setCurrentUser(user);
      console.log('user', user);
    });
    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signup,
    login,
    logout,
    isLoggedIn,
    setIsLoggedIn,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>)
}
