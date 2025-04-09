// hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '../lib/api';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay una sesión activa
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error al verificar sesión:', error);
          setUser(null);
        } else if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error inesperado:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Suscribirse a cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Función para registrarse
  const signUp = async (email, password, fullName) => {
    setLoading(true);
    const { data, error } = await authAPI.signUp(email, password, fullName);
    setLoading(false);
    return { data, error };
  };

  // Función para iniciar sesión
  const signIn = async (email, password) => {
    setLoading(true);
    const { data, error } = await authAPI.signIn(email, password);
    setLoading(false);
    return { data, error };
  };

  // Función para cerrar sesión
  const signOut = async () => {
    setLoading(true);
    const { error } = await authAPI.signOut();
    if (!error) {
      router.push('/');
    }
    setLoading(false);
    return { error };
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
