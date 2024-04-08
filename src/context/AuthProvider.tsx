
import { ReactNode, createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";

type AuthContextData = {
    signed: boolean;
    user: UserProps | null;
}

interface AuthProviderProps {
    children: ReactNode
}

interface UserProps {
    uid: string;
    email: string | null;
}

export const AuthContext = createContext({} as AuthContextData)

function AuthProvider({children}: AuthProviderProps){
   
    const [user, setUser] = useState<UserProps | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (data) => {
            if(data){
                setUser({
                    uid: data.uid,
                    email: data?.email
                })
            }else{
                setUser(null)
            }
            setLoadingAuth(false)
        })

        return () => {
            unsub();
        }
    }, [])

    useEffect(() => {
        console.log('VALIDANDO RECEBIMENTO DE INFORMAÇÕES COM SUCESSO!');
    }, [user]);

    if(loadingAuth){
        return( 
            <div className="flex w-svw h-svh items-center justify-center">
                <h1 className="text-center rounded-2xl bg-white w-1/3 text-xl font-bold">Aguarde um momento...</h1>
            </div>
        )
    }

    return(
        <AuthContext.Provider
            value={{
                signed: !!user,
                user
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;