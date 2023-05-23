import React from "react";
import {useSession, signIn, signOut} from 'next-auth/react'

const login = () => {
    const { data: session, status } = useSession(); 

    if(session){
        return (
            <div>
                <p>Welcome, {session.user.email}</p>
                <button onClick={()=> signOut()}>Sign out</button>
                <img src={session.user.image} alt={session.user.name} style={{borderRadius: '50px'}} />
            </div>
        )
    } else {
        return (
            <div>
                <p>Please log in</p>
                <button onClick={()=> signIn()}>Sign in</button>
            </div>
        )
    }
}

export default login