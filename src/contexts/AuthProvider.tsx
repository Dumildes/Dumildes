import React, {ReactNode} from 'react';
import { useContext, createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import CNPApi from '../services/CNPApi';

interface User {
    id: string;
    email: string;
}

interface AuthContextType {
    token: string;
    user: User | null;
    loginAction: (email: string, senha: string) => Promise<void>;
    logOut: () => void;
    errorMessage: string;
    showError: boolean;
    load: boolean;
  }
  
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  interface AuthProviderProps {
    children: ReactNode;
  }

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const navigate = useNavigate();

    const [load, setLoad] = useState<boolean>(false)
    const [user, setUser] = useState<User | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showError, setShowError] = useState<boolean>(false);
    const [token, setToken] = useState<string>(localStorage.getItem("token") || "");

    const loginAction = async (email: string, senha: string): Promise<void> => {
        setLoad(true)
        CNPApi.post('/auth/login-admin', {
            email: email,
            password: senha
        }).then(res => {
            setLoad(false)
            setUser(res.data.user);
            setToken(res.data.token);
            localStorage.setItem("token", res.data.token);
            navigate("/admin/ordem");
        }).catch(err => {
            console.log(err)
            setLoad(false)
            setShowError(true);
            setErrorMessage(err.response?.data?.message || " Ocoreu algum erro!")
        })
    }

    const logOut = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("token");
        navigate("/login");
    }

    useEffect(() => {
        if (token) {
            CNPApi.post('/auth/is-logged-admin', { 'token': token })
                .then((response) => {
                    if (response.data.user) {
                        setUser(response.data.user);
                    } else {
                        setErrorMessage(response.data.error);
                    }
                })
                .catch(() => {
                    logOut();
                })
        }
    }, [token]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowError(false);
        }, 4000);

        return () => clearTimeout(timer);
    }, [errorMessage])

    const contextValue: AuthContextType = {
        token,
        user,
        loginAction,
        logOut,
        errorMessage,
        showError,
        load
      };

    return (<AuthContext.Provider value={contextValue}>
        {children}
    </AuthContext.Provider>)
};

export default AuthProvider;

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
  };