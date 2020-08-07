import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import apolloClient from './ApolloConfig'
import LoginPage from './Login Page/LoginPage';
import Home from './Home/Home';
import App from './App/App'
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import UserContext from './UserContext';

function Routes() {
    const [user, setUser] = useState();

    console.log(user);

    axios.interceptors.request.use(
        function(request) {
            request.headers["Content-Type"] = 'application/json; charset=utf-8';
            request.headers["Accept"] = 'application/json';
            request.headers["authorization"] = user ? `Bearer ${user.accessToken}` : "";
            request.withCredentials = true;
            return request;
        },
        function(error) {
            return Promise.reject(error);
        }
    );

    const value = useMemo(() => ([user, setUser]), [user, setUser]);

    useEffect(() => {
        const updateUser = (userData) => {
            if(!userData.accessToken){
                setUser(null);

                return;
            }

            setUser({
              username: userData.username,
              role: userData.role,
              accessToken: userData.accessToken
            })
        
            return;
        }

        axios.get("http://localhost:3000/refreshToken")
            .then((response) => {
                updateUser(response.data);

                return;
            })
            .catch((error) => {
                console.log(error.data);
                 return;
            });
    }, []);

    return (
        <Router> 
            <UserContext.Provider value={value}>
                <ApolloProvider client={apolloClient}>
                    <Switch>
                        <Route exact={true} path="/"><Redirect to="/home"/></Route>
                        <Route path="/app" component={App}/>
                        <Route path="/home" component={Home}/>
                        <Route path="/login" component={LoginPage}/>
                    </Switch>
                </ApolloProvider>
            </UserContext.Provider>
        </Router>
    );
};

export default Routes;