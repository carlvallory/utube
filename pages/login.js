import React from "react";
import {useSession, signIn, signOut} from 'next-auth/react'

const login = () => {
    const { data: session, status } = useSession();

    return (
        <div>login</div>
    )
}

export default login