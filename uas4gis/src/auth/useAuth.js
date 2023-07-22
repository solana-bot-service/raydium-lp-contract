import { useState } from "react";
import axios from 'axios';
import { faker } from '@faker-js/faker';

export const useAuth = () => {
    
    const [user, setUser] = useState(null)

    const signIn = async (data) => {
        try {
            let authresult = await axios.post('/api/auth/login', data);
            let userObj = { ...authresult.data?.foundUser };
            userObj.token = authresult.data?.encodedToken;
            setUser(userObj);
            // toastsuccess("Login Successfull")
        } catch (err) {
            console.error(err);
            // toasterror("Login Failed")
        }
    };

    const lineLogin = async (data) => {
        let state = faker.string.uuid()
        try {
            let authresult = await axios.post('https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1657781805&state='+ state +'&redirect_uri=http://localhost:3000&scope=profile%20openid&nonce=09876xyz', data);
            let userObj = { ...authresult.data?.foundUser };
            userObj.token = authresult.data?.encodedToken;
            setUser(userObj);
            // toastsuccess("Login Successfull")
        } catch (err) {
            console.error(err);
            // toasterror("Login Failed")
        }
    };

    const signUp = async (data) => {
        try {
            let authresult = await axios.post('/api/auth/signup', data);
            let userObj = { ...authresult.data?.createdUser };
            userObj.token = authresult.data?.encodedToken;
            setUser(userObj);
            // toastsuccess("Sign Up Successfull")
        } catch (err) {
            console.error(err);
            // toasterror("An Error Occuered")
        }
    };

    const signOut = () => {
        setUser(null);
    };

    return { user, signIn, lineLogin, signUp, signOut };
};