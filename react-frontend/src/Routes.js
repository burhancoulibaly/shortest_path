import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import apolloClient from './ApolloConfig'
import LoginPage from './Login Page/LoginPage';
import Home from './Home/Home';
import Account from "./Account/Account";
import App from './App/App';
import TenPaths from './TenPaths/TenPaths';
import Sandbox from './Sandbox/Sandbox';
import Multiplayer from './Multiplayer/Multiplayer';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import UserContext from './UserContext';
import RouteGuard from './RouteGuard';
import TopNav from "./TopNav/TopNav";

//Using containers so top nav is not rendered on login page
const LoginContainer = ({user, logout, updateUser}) => {
    return(
        <div>
            <RouteGuard 
                path="/login" 
                component={LoginPage}
                user={user}
                logout={logout}
                updateUser={updateUser}
            />
        </div>
    )
}

const DefaultContainer = ({user, logout}) => {
    return(
        <div>
            <TopNav 
                logout={logout}
            />
            <Route exact={true} path="/"><Redirect to="/home"/></Route>
            <RouteGuard 
                path='/app' 
                component={App} 
                user={user}
            />
            <RouteGuard 
                path='/home' 
                component={Home} 
                user={user}
            />
            <RouteGuard 
                path='/account' 
                component={Account} 
                user={user}
            />
            <RouteGuard 
                path='/tenpaths' 
                component={TenPaths} 
                user={user}
            />
            <RouteGuard 
                path='/sandbox' 
                component={Sandbox} 
                user={user}
            />
            <RouteGuard 
                path='/multiplayer' 
                component={Multiplayer} 
                user={user}
            />
        </div>
    )
}

//Update user
const updateUser = (userData, setUser) => {
    if(!userData || !userData.accessToken || !userData.response_type || userData.response_type !== "Success"){
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

//Log user out
const logout = (setUser) => {
    axios.get("http://localhost:3000/deleteRefreshToken")
        .then((response) => {
            updateUser(response.data, setUser);

            return;
        })
        .catch((error) => {
            console.log(error.data);
            updateUser(error.data, setUser);

            return;
        });
}

function Routes() {
    //Stores user data if user is logged in and null if user isn't logged in
    const [user, setUser] = useState();

    console.log(user);

    //Adds headers to every axios request(requests)
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

    //will only recompute the memoized value when one of the dependencies has changed
    const value = useMemo(() => ([user, setUser]), [user, setUser]);

    //To make sure tokenRefresh attempt is only made once.
    useEffect(() => {
        axios.get("http://localhost:3000/refreshToken")
            .then((response) => {
                // console.log(response.data);
                updateUser(response.data, setUser);

                return;
            })
            .catch((error) => {
                console.log(error);

                logout(setUser);

                return;
            });
    }, []);

    return (
        <Router>
            <UserContext.Provider value={value}>
                <ApolloProvider client={apolloClient}>
                    <Switch>
                        {/* Render is used to pass props to components rendered by React Router */}
                        <Route
                            exact 
                            path="/login" 
                            render={() => (
                                <LoginContainer
                                    user={user}
                                    logout={logout}
                                    updateUser={updateUser}
                                />
                            )}
                        />
                        <Route
                            render={() => (
                                <DefaultContainer
                                    user={user}
                                    logout={logout}
                                />
                            )}
                        />
                    </Switch>
                </ApolloProvider>
            </UserContext.Provider>
        </Router>
    );
};
export default Routes;