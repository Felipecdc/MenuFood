
import React, { useState, useEffect } from "react";
import { Container } from "../../components/container"
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { auth } from "../../services/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export function Login(){

    useEffect(() => {
        document.title = "Login - Name Oficial"
    }, [])

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        async function handleLogout(){
            await signOut(auth)
        }
        handleLogout()   
    }, [])

    async function handleLogin(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()

        if(email === '' && password === ''){
            toast.warn('Preencha os campos!')
            return
        }

        signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            toast.success('Bem vindo, bom trabalho!')
            navigate("/dashboard", {replace: true})
        })
        .catch((err) => {
            toast.error('Erro ao logar, tente mais tarde!')
            console.log('ERROR: ', err)
        })
    }

    return(
        <>
        <Container>
            <div className="flex w-full h-vh items-center justify-center">
                <form 
                    className="flex p-8 rounded-lg bg-white flex-col items-start justify-center"
                    action=""
                    onSubmit={handleLogin}
                >
                    <label htmlFor="email">Email</label>                    
                    <input 
                        className="border px-2 py-1 mb-5 border-gray-500 rounded-md"
                        type="email" 
                        value={email}
                        onChange={ e => setEmail(e.target.value)}
                    />
                    <label htmlFor="password">Senha</label>                    
                    <input 
                        className="border px-2 py-1 mb-5 border-gray-500 rounded-md"
                        type="password"
                        value={password}
                        onChange={ e => setPassword(e.target.value)} 
                    />
                    <button 
                        type="submit"
                        className="w-full h-10 text-white font-bold rounded-md bg-black"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </Container>
        </>
    )
}