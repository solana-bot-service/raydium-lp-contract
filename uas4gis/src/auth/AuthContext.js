import { createContext, useContext } from "react"
import { useAuth } from "./useAuth"

const AuthContext = createContext()

const useAuthContext = () => useContext(AuthContext)

const AuthProvider = ({children}) => {

    const auth = useAuth()

    return <AuthContext.Provider value={auth}>
        {children}
    </AuthContext.Provider>
}

export { useAuthContext, AuthProvider}