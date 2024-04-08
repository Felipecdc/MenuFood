import { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

interface PrivateProps {
    children: ReactNode
}

export function Private({children}: PrivateProps): JSX.Element | null{

    const { signed } = useContext(AuthContext);

    if(!signed){
        return <Navigate to={"/login"} />
    }

    return <>{children}</>
}

